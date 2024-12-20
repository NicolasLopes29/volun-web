import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase-config"; // Import Firebase auth
import "./../css/DadosPessoal.css";
import defaultProfileImage from "../assets/images/photo-perfil.png"; // Imagem de perfil padrão

const DadosPessoal = () => {
    const [userDados, setUserDados] = useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        dataNasc: "",
        ddd: "",
        telefone: "",
    });
    const [uid, setUid] = useState(null);
    const [erro, setErro] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUid(user.uid);
        } else {
            navigate("/");
        }
    }, [navigate]);


    const formatarNome = (nome) =>{
        nome = nome.replace(/[^a-zA-ZáéíóúàèìòùãõâêîôûçÇÁÉÍÓÚÀÈÌÒÙ\s]/g, '');
        return nome;
    }

    const formatarSobrenome = (sobrenome) => {
        sobrenome = sobrenome.replace(/[^a-zA-ZáéíóúàèìòùãõâêîôûçÇÁÉÍÓÚÀÈÌÒÙ\s]/g, '');
        return sobrenome;
    }

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cpf.length !== 11 || /^(.)\1+$/.test(cpf)) {
            return false;
        }

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let rev1 = 11 - (soma % 11);
        if (rev1 === 10 || rev1 === 11) rev1 = 0;
        if (rev1 !== parseInt(cpf.charAt(9))) return false;
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }

        let rev2 = 11 - (soma % 11);
        if (rev2 === 10 || rev2 === 11) rev2 = 0;
        return rev2 === parseInt(cpf.charAt(10));
    };

    const formatarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o primeiro ponto
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2"); // Coloca o segundo ponto
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca o hífen
        return cpf;
    };

    const formatarDDD = (ddd) => {
        // Remove caracteres não numéricos
        ddd = ddd.replace(/\D/g, '');
    
        // Permite que o DDD tenha até 2 caracteres
        if (ddd.length <= 2) {
            return ddd; // Retorna o DDD formatado corretamente
        }
    
        return ddd.substring(0, 2); // Limita a 2 caracteres
    };
    
    const formatarTelefone = (telefone) => {
        // Remove caracteres não numéricos
        telefone = telefone.replace(/\D/g, '');
    
        // Aplica a formatação conforme o número de dígitos
        if (telefone.length <= 5) {
            return telefone.replace(/(\d{1,5})/, "$1"); // Exemplo: 12345
        }
    
        return telefone.replace(/(\d{5})(\d{4})/, "$1-$2"); // Exemplo: 12345-6789
    };
    
    
    
    const EnviarDados = async (e) => {
        e.preventDefault();
        setErro(false);
        setSucesso(false);

        const { nome, sobrenome, cpf, dataNasc, ddd, telefone } = userDados;

        if (!nome || !sobrenome || !cpf || !dataNasc || !ddd || !telefone) {
            setErro(true);
            return;
        }

        if (!validarCPF(cpf)) {
            alert("CPF inválido");
            return;
        }

        const photoUrl = auth.currentUser?.photoURL || defaultProfileImage ;

        try {
            // Tenta enviar os dados para a API
            const response = await axios.post(`https://volun-api-eight.vercel.app/usuarios/${uid}/info`, {
                nome,
                sobrenome,
                cpf,
                data_nascimento: dataNasc,
                ddd,
                telefone,
                photoUrl
            });

            if (response.status === 201) {
                setSucesso(true);
                navigate("/dados_endereco"); // Redireciona para a página inicial
            }
        } catch (error) {
            console.error("Erro ao enviar dados: ", error);
            setErro(true);
        }
    };

    return (
        <div className="dados-container">
            <div className="dados-pessoal-container">
                <h4>Insira os dados pessoais</h4>
                <form onSubmit={EnviarDados}>
                    <div>
                        <label htmlFor="nome">Nome: </label>
                        <input
                            className="dados-input"
                            type="text"
                            name="nome"
                            value={userDados.nome}
                            placeholder="Digite seu nome"
                            onChange={(e) => setUserDados({ ...userDados, nome: formatarNome(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label htmlFor="sobrenome">Sobrenome: </label>
                        <input
                            className="dados-input"
                            type="text"
                            name="sobrenome"
                            value={userDados.sobrenome}
                            placeholder="Digite seu sobrenome"
                            onChange={(e) => setUserDados({ ...userDados, sobrenome: formatarSobrenome(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf">CPF: </label>
                        <input
                            className="dados-input-medio"
                            type="text"
                            name="cpf"
                            value={userDados.cpf}
                            placeholder="000.000.000-00"
                            onChange={(e) => setUserDados({ ...userDados, cpf: formatarCPF(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label htmlFor="dataNasc">Data de Nascimento: </label>
                        <input
                            className="dados-input-medio"
                            type="date"
                            name="dataNasc"
                            value={userDados.dataNasc}
                            onChange={(e) => setUserDados({...userDados, dataNasc: e.target.value})}
                            min="1900-01-01" // Data mínima permitida
                            max={`${new Date().toISOString().split("T")[0]}`} // Data máxima (hoje)      
                        />
                    </div>

                    <div>
                        <div>
                            <label htmlFor="ddd">DDD: </label>
                            <input
                                className="dados-input-pequeno"
                                type="text"
                                name="ddd"
                                value={userDados.ddd}
                                placeholder="Ex: 11"
                                onChange={(e) => setUserDados({ ...userDados, ddd: formatarDDD(e.target.value) })}
                            />
                        </div>
                        <div>                            
                            <label htmlFor="telefone">Telefone: </label>
                            <input
                                className="dados-input"
                                type="text"
                                name="telefone"
                                value={userDados.telefone}
                                placeholder="12345-6789"
                                onChange={(e) => setUserDados({ ...userDados, telefone: formatarTelefone(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit">Finalizar Cadastro</button>
                    </div>
                    {erro && <p className="erro-mensagem">Preencha todos os campos corretamente.</p>}
                    {sucesso && <p className="sucesso-mensagem">Usuário cadastrado com sucesso!</p>}
                </form>
            </div>
        </div>
    );
};

export default DadosPessoal;
