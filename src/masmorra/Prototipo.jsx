// Protótipo da masmorra (/masmorra): o jogo com as questões do próprio site, sem login.
// Fica num arquivo separado para ser baixado só quando alguém abre o protótipo.
import Masmorra from "./Masmorra.jsx";
import { fonteLocal } from "./fontes.js";

export default function Prototipo() {
  return <Masmorra fonte={fonteLocal} prototipo />;
}
