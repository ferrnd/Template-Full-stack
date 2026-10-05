'use client';

import FormModal from '@/components/formModal';
import axios from 'axios';
import { Button, Card, Modal, Skeleton } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
            toast.success('Série excluída!', { id: 'read-id' });
            router.push('/read');
        } catch {
            toast.error('Erro ao excluir a série.', { id: 'read-id' });
        } finally {
            setDeleting(false);
            setDeleteOpen(false);
        }
    }

    return (
        <main>
            <h2>Get By Id - read</h2>
            <p>O navegador busca, edita e exclui pelo /api/series/[id] (nosso route.js); o servidor fala com a API usando a api-key privada.</p>
            <p>Abra o DevTools - Network: aparece a série (GET/PUT/DELETE), sem x-api-key.</p>

            {loading ? (
                <div className="skeleton">
                    <Skeleton active />
                </div>
            ) : (
                serie && (
                    <>
                        <Card title={serie.title}>
                            <p>Gênero: {serie.genero}</p>
                            <p>Plataforma: {serie.plataforma}</p>
                            <p>Temporadas: {serie.numero_temporadas}</p>
                            <p>Ano de lançamento: {serie.ano_lancamento}</p>
                        </Card>

                        <div className="actions">
                            <Button type="primary" onClick={() => setEditOpen(true)}>
                                Editar
                            </Button>
                            <Button danger onClick={() => setDeleteOpen(true)}>
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

                        <Modal
                            open={deleteOpen}
                            title="Excluir série"
                            okText="Excluir"
                            cancelText="Cancelar"
                            okButtonProps={{ danger: true }}
                            confirmLoading={deleting}
                            onOk={handleDelete}
                            onCancel={() => setDeleteOpen(false)}
                        >
                            <p>Tem certeza que deseja excluir esta série?</p>
                        </Modal>
                    </>
                )
            )}
        </main>
    );
}