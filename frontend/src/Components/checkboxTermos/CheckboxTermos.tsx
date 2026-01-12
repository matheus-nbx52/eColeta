import './CheckboxTermos.css';

interface CheckboxTermosProps {
  valor: boolean;
  onChange: (valor: boolean) => void;
}

export default function CheckboxTermos({ valor, onChange }: CheckboxTermosProps) {
  return (
    <div className="container-termos-reutilizavel">
      <input 
        type="checkbox" 
        id="termos-uso" 
        checked={valor}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="termos-uso">
        Eu li e aceito os 
        <a href="/termos-uso" target="_blank" rel="noreferrer"> Termos de Uso </a> 
        e a 
        <a href="/politica-privacidade" target="_blank" rel="noreferrer"> Política de Privacidade</a>
      </label>
    </div>
  );
}