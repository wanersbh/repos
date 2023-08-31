import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { BackButton, Container, IssuesList, Loading, Owner, PageActions, FilterButtons } from "./styles";

export default function Repositorio() {

    const { repositorio } = useParams();

    const [repo, setRepo] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState([
        { state: 'all', label: 'Todas', active: true },
        { state: 'open', label: 'Abertas', active: false },
        { state: 'closed', label: 'Fechadas', active: false },
    ]);
    const [filterIndex, setFilterIndex] = useState(1);

    useEffect(() => {
        async function loadRepo() {

            const [repoData, issuesData] = await Promise.all([
                api.get(`/repos/${repositorio}`),
                api.get(`/repos/${repositorio}/issues`, {
                    params: {
                        state: filters.find(f => f.active).state,
                        per_page: 5
                    }
                })
            ]).finally(() => {
                setLoading(false);
            });

            setRepo(repoData.data);
            setIssues(issuesData.data);
        }

        loadRepo();
    }, []);

    useEffect(() => {

        async function loadIssue() {
            await api.get(`/repos/${repositorio}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page,
                    per_page: 5
                },
            }).then((response) => {
                setIssues(response.data);
            })
        }
        
        console.log(filters[filterIndex].state);

        loadIssue();
    }, [page, filterIndex]);


    async function handlePage(action) {
        setPage(action === 'back' ? page - 1 : page + 1)
    }

    function handleFilter(index){
        setFilterIndex(index);
    }

    if (loading) {
        return (
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }

    return (
        <Container>

            <BackButton to="/">
                <FaArrowLeft color="#000" size={25} />
            </BackButton>

            <Owner>
                <img src={repo.owner.avatar_url} alt={repo.owner.login} />
                <h1>{repo.name}</h1>
                <p>{repo.description}</p>
            </Owner>

            {issues.length > 0 && (
                <FilterButtons active={filterIndex}>
                    {filters.map((filter, index) => (
                        <button type="button" key={filter.label} onClick={() => handleFilter(index)}>
                            {filter.label}
                        </button>
                    ))}

                </FilterButtons>
            )}



            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />

                        <div>
                            <strong>
                                <a href={issue.html_url} target="_blank">{issue.title}</a>

                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>

                            <p>{issue.user.login}</p>

                        </div>
                    </li>
                ))}
            </IssuesList>

            {issues.length > 0 ? (
                <PageActions>
                    <button
                        type='button'
                        onClick={() => handlePage('back')}
                        disabled={page < 2}
                    >
                        Voltar
                    </button>
                    <span>{page}</span>
                    <button type='button' onClick={() => handlePage('next')}>
                        Próxima
                    </button>
                </PageActions>
            ) : (
                <span>Não há nenhuma issue para esse projeto!</span>
            )}



        </Container>
    );
}