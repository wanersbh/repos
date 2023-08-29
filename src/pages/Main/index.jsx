import React, { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';
import { Container, Form, SubmitButton } from './styles';
import { toast } from "react-toastify";

export default function Main() {

    const { register, handleSubmit, reset } = useForm();

    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);

    async function handleAddRepo(data) {

        setLoading(true);
        api
            .get(`/repos/${data.repositorio}`)
            .then((res) => {
                const data = {
                    name: res.data.full_name
                }

                setRepositorios([...repositorios, data]);
                reset();
                toast.success('Repositório adicionado com sucesso!')
            })
            .catch((error) => {
                toast.error('Repositorio não encontrado');
            })
            .finally(() => {
                setLoading(false);
            });

    }

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit(handleAddRepo)}>
                <input
                    type='text'
                    placeholder="Adicionar Repositorios"
                    {...register('repositorio', { required: true })}
                    id="repositorio"
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus color="#FFF" size={14} />
                    )}

                </SubmitButton>
            </Form>

        </Container>
    );
}