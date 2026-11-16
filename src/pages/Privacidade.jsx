import { Link } from "react-router-dom";

export default function Privacidade() {
  return (
    <main>
      <Link to="/">‹ Início</Link>
      <h1>Privacidade</h1>
      <div className="card">
        <h2>O que guardamos do aprendiz</h2>
        <p>Só o primeiro nome ou apelido digitado e as respostas do jogo. Não pedimos e-mail, senha, telefone, foto nem localização.</p>
      </div>
      <div className="card">
        <h2>Quem vê os dados</h2>
        <p>Somente o Mestre que criou a sala. Um Mestre não vê os dados de outro.</p>
      </div>
      <div className="card">
        <h2>O que não fazemos</h2>
        <p>Não temos anúncios, não usamos rastreadores e não vendemos nem compartilhamos dados.</p>
      </div>
      <div className="card">
        <h2>Para escolas e famílias</h2>
        <p>O uso com crianças depende de autorização da escola e dos responsáveis. O Mestre pode excluir uma sala a qualquer momento, e os dados dela são apagados junto.</p>
      </div>
    </main>
  );
}
