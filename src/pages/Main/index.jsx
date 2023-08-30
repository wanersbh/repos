import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Container, Form, SubmitButton, List, DeleteButton, ErrorMsg } from './styles';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


const schema = yup.object({
    repositorio: yup.string().required('O campo repositório é obrigatório!')
});

export default function Main() {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);

    //Busca
    useEffect(()=>{
        const repoConvertido = JSON.parse(localStorage.getItem('@repos'));
        
        if(repoConvertido.length > 0){
            setRepositorios(repoConvertido);
        }

    },[])

    //Salvar alterações
    useEffect(()=>{
        localStorage.setItem('@repos', JSON.stringify(repositorios));
    },[repositorios])

    const handleSubmitApp = useCallback((data) => {

        async function handleAddRepo(data) {

            const repo = data.repositorio;

            if (repositorios.some(r => r.name === repo)) {
                toast.error('Repositório já está na lista!');
                return;
            }

            setLoading(true);
            api
                .get(`/repos/${repo}`)
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

        handleAddRepo(data);

    }, [repositorios])



    const handleDelete = useCallback((repo) => {
        const listaAtualizada = repositorios.filter(r => r.name !== repo);
        setRepositorios(listaAtualizada);

    }, [repositorios]);

    return (
        <Container>
            <h1>
                <FaGithub size={25} />
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit(handleSubmitApp)}  as="form" error={errors.repositorio}>
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
            <ErrorMsg>{errors.repositorio?.message}</ErrorMsg>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repositorio/${ encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>

        </Container>
    );
}