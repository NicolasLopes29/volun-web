import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

const DadosEndereco = () => {
    const [enderecoDados, setEnderecoDados] = useState({
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
    });
    const [erro, setErro] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    const navigate = useNavigate();

    const Estado = () => {
        return [
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", 
            "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", 
            "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        ];
    };

    const buscarCEP = async (e) => {
        e.preventDefault();
        const cep = enderecoDados.cep.replace(/\D/g, '');
        if (cep.length >= 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setEnderecoDados({
                        ...enderecoDados,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf,
                    });
                } else {
                    alert("CEP não encontrado.");
                }
            } catch (error) {
                alert("Erro ao buscar CEP. Tente novamente.");
            }
        } else {
            alert("CEP inválido.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(false);
        setSucesso(false);

        const { cep, logradouro, numero, bairro, cidade, estado } = enderecoDados;

        if (!cep || !logradouro || !numero || !bairro || !cidade || !estado) {
            setErro(true);
            return; // Adicionando um return para não prosseguir se houver erro
        }

        try {
            const response = await axios.post(`https://volun-api-eight.vercel.app/endereco/`, {
                cep,
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
            });

            if (response.status === 201){
                setSucesso(true);
                navigate('/')
            }
             // Definindo sucesso
        } catch (error) {
            console.error("Erro ao enviar dados do endereco: ", error);
            setErro(true);
        }
    };

    return (
        <div className="dados-container">
            <h4>Insira os dados de endereço</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cep">CEP: </label>
                    <input
                        className="input-medio"
                        type="text"
                        value={enderecoDados.cep}
                        onChange={(e) => setEnderecoDados({ ...enderecoDados, cep: e.target.value })}
                    />
                    <button type="button" onClick={buscarCEP}>Buscar</button>
                </div>
                <div className="form-group">
                    <label htmlFor="dadosEndereco">Endereço: </label>
                    <input
                        className="input-grande"
                        type="text"
                        value={enderecoDados.logradouro}
                        onChange={(e) => setEnderecoDados({ ...enderecoDados, logradouro: e.target.value })}
                    />
                    <label htmlFor="dadosNumero">Número: </label>
                    <input
                        className="input-pequeno"
                        type="text"
                        value={enderecoDados.numero}
                        onChange={(e) => setEnderecoDados({ ...enderecoDados, numero: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dadosBairro">Bairro: </label>
                    <input
                        className="input-grande"
                        type="text"
                        value={enderecoDados.bairro}
                        onChange={(e) => setEnderecoDados({ ...enderecoDados, bairro: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dadosCidade">Cidade: </label>
                    <input
                        className="input-grande"
                        type="text"
                        value={enderecoDados.cidade}
                        onChange={(e) => setEnderecoDados({ ...enderecoDados, cidade: e.target.value })}
                    />
                    <label htmlFor="dadosEstado">Estado: </label>
                    <select
                        className="input-pequeno"
                        value={enderecoDados.estado}
                        onChange={(e) => setEnderecoDados({ ...enderecoDados, estado: e.target.value })}
                    >
                        <option>-- selecione o estado --</option>
                        {Estado().map((estado, index) => (
                            <option key={index} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <button type="submit">Cadastrar</button>
                </div>
                {erro && <p className="error">Por favor, preencha todos os campos obrigatórios.</p>}
                {sucesso && <p className="success">Endereço enviado com sucesso!</p>}
            </form>
        </div>
    );
};

export default DadosEndereco;
