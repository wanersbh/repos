import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { BackButton, Container, IssuesList, Loading, Owner } from "./styles";

export default function Repositorio() {

    const { repositorio } = useParams();

    const [repo, setRepo] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRepo() {

            const [repoData, issuesData] = await Promise.all([
                api.get(`/repos/${repositorio}`),
                api.get(`/repos/${repositorio}/issues`,{
                    params:{
                        state: 'open',
                        per_page: 5
                    }
                })
            ]);

            setRepo(repoData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        loadRepo();
    }, [])

    if(loading){
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }

    return (
        <Container>

            <BackButton  to="/">
                <FaArrowLeft color="#000" size={25} />
            </BackButton>

            <Owner>
                <img src={repo.owner.avatar_url} alt={repo.owner.login} />
                <h1>{repo.name}</h1>
                <p>{repo.description}</p>
            </Owner>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />

                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map(label=> (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>

                            <p>{issue.user.login}</p>

                        </div>
                    </li>
                ))}
            </IssuesList>

        </Container>
    );
}