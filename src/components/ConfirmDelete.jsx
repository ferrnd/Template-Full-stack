'use client';

import { Button, Modal, Space } from 'antd';
import styles from './ConfirmDelete.module.css';

export default function ConfirmDelete({ openModal, serie, confirmLoading, onConfirm, onCancel }) {
    return (
        <Modal
            open={openModal}
            title={<div className={styles.title}>Confirmar Exclusão</div>}
            centered
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <p className={styles.message}>Tem certeza que deseja excluir a série "{serie?.title}"?</p>
            <div className={styles.actions}>
                <Space>
                    <Button onClick={onCancel} disabled={confirmLoading}>
                        Cancelar
                    </Button>
                    <Button danger type="primary" loading={confirmLoading} onClick={onConfirm}>
                        Excluir
                    </Button>
                </Space>
            </div>
        </Modal>
    );
}