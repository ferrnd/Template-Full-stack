'use client';

import { Button, Card, Image, Skeleton } from 'antd';
import axios from 'axios';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConfirmDelete from '@/components/ConfirmDelete';
import FormModal from '@/components/formModal';
import styles from './page.module.css';

export default function ReadByIdPage() {
    const { id } = useParams();
    const router = useRouter();
    const [serie, setSerie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        async function buscarSerie() {
            try {
                const response = await axios.get(`/api/series/${id}`);
                setSerie(response.data?.data ?? response.data);
            } catch (error) {
                toast.error('Série não encontrada.', { id: 'read-id' });
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        if (id) buscarSerie();
    }, [id]);

    async function handleUpdate(values) {
        setSaving(true);

        try {
            const response = await axios.put(`/api/series/${id}`, values);
            setSerie(response.data?.data ?? response.data ?? values);
            setEditOpen(false);
            toast.success('Série atualizada!', { id: 'read-id' });
        } catch {
            toast.error('Erro ao atualizar a série.', { id: 'read-id' });
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);

        try {
            await axios.delete(`/api/series/${id}`);
            toast.success('Série excluída!', { id: 'delete-sucess' });
            router.push('/read');
        } catch {
            toast.error('Erro ao excluir a série.', { id: 'delete-error' });
        } finally {
            setDeleting(false);
            setDeleteOpen(false);
        }
    }

    return (
        <main className={styles.page}>
            <h2 className={styles.heading}>Get By Id - read</h2>
            <p className={styles.description}>
                O navegador busca, edita e exclui pelo /api/series/[id]; o servidor fala com a API usando a api-key privada.
            </p>
            <p className={styles.networkNote}>
                No DevTools, a chamada aparece sem x-api-key no navegador.
            </p>

            {loading ? (
                <div className="skeleton">
                    <Skeleton active />
                </div>
            ) : (
                serie && (
                    <>
                        <Card title={serie.title} className={styles.seriesCard}>
                            <div className={`${styles.seriesContent} ${serie.imageUrl ? styles.withImage : ''}`}>
                                {serie.imageUrl && (
                                    <div className={styles.posterFrame}>
                                        <Image
                                            src={serie.imageUrl}
                                            alt={`Imagem de ${serie.title}`}
                                            width="100%"
                                            className={styles.poster}
                                        />
                                    </div>
                                )}
                                <div className={styles.details}>
                                    <dl className={styles.facts}>
                                        <div className={styles.fact}>
                                            <dt>Gênero</dt>
                                            <dd>{serie.genero}</dd>
                                        </div>
                                        <div className={styles.fact}>
                                            <dt>Plataforma</dt>
                                            <dd>{serie.plataforma}</dd>
                                        </div>
                                        <div className={styles.fact}>
                                            <dt>Temporadas</dt>
                                            <dd>{serie.numero_temporadas}</dd>
                                        </div>
                                        <div className={styles.fact}>
                                            <dt>Ano de lançamento</dt>
                                            <dd>{serie.ano_lancamento}</dd>
                                        </div>
                                    </dl>
                                    {serie.imageUrl && (
                                        <a
                                            className={styles.imageLink}
                                            href={serie.imageUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <ExternalLink size={15} aria-hidden="true" />
                                            Abrir imagem original
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <div className={styles.actions}>
                            <Button type="primary" icon={<Pencil size={16} />} onClick={() => setEditOpen(true)}>
                                Editar
                            </Button>
                            <Button danger icon={<Trash2 size={16} />} onClick={() => setDeleteOpen(true)}>
                                Excluir
                            </Button>
                        </div>

                        <FormModal
                            openModal={editOpen}
                            serie={serie}
                            confirmLoading={saving}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditOpen(false)}
                        />

                        <ConfirmDelete
                            openModal={deleteOpen}
                            serie={serie}
                            confirmLoading={deleting}
                            onConfirm={handleDelete}
                            onCancel={() => setDeleteOpen(false)}
                        />
                    </>
                )
            )}
        </main>
    );
}