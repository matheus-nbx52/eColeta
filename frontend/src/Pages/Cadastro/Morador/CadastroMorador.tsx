function CadastroMorador () {
    return (
        <div>
        <h3>Cadastro de morador</h3>
        <p>Preencha seus dados para solicitar coletas</p>
        <form>
            <input type="text" placeholder="Nome Completo"/>
            <input type="text" placeholder="CPF"/>
            <input type="email"placeholder="E-mail" />
            <input type="tel" placeholder="Telefone"/>
            <h4>Endereço</h4>
            <input type="text"placeholder="CEP" />
            <input type="text" />
        </form>

        </div>
    )
}

export default CadastroMorador