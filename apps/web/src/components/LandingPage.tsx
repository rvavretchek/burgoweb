import { landingContent } from '../content/landing';
import { StartCta } from './StartCta';

const benefits = [
  ['Organize a rotina', 'Reúna informações administrativas e documentos sem depender de conhecimento especializado.'],
  ['Acompanhe os gastos', 'Mantenha as informações financeiras compreensíveis para quem administra e acompanha.'],
  ['Preste contas com clareza', 'Compartilhe informações coletivas com transparência e respeito à privacidade.'],
] as const;

export function LandingPage() {
  return (
    <>
      <header className="site-header" aria-label="Cabeçalho principal">
        <a className="brand" href="/" aria-label="Burgoweb, página inicial">Burgoweb</a>
        <span className="header-note">Gratuito para começar e continuar</span>
      </header>
      <main id="conteudo-principal">
        <section className="hero" aria-labelledby="titulo-principal">
          <div className="hero-copy">
            <p className="eyebrow">{landingContent.category}</p>
            <h1 id="titulo-principal">{landingContent.title}</h1>
            <p className="lead">{landingContent.summary}</p>
            <StartCta label={landingContent.cta} />
            <p className="supporting-copy">{landingContent.permanence}</p>
          </div>
          <aside className="trust-card" aria-label="Compromissos do Burgoweb">
            <h2>Feito para condomínios que cuidam da própria gestão</h2>
            <p>Comece aos poucos, preserve documentos e mantenha um histórico útil para moradores, conselho e futuras gestões.</p>
            <p>{landingContent.ownership}</p>
          </aside>
        </section>
        <section className="benefits" aria-labelledby="beneficios-titulo">
          <div className="section-heading">
            <p className="eyebrow">O essencial em um só lugar</p>
            <h2 id="beneficios-titulo">Mais organização para decidir e informar melhor</h2>
          </div>
          <div className="benefit-grid">
            {benefits.map(([title, description]) => (
              <article className="benefit-card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="scope-note" aria-labelledby="escopo-titulo">
          <div>
            <p className="eyebrow">Uma proposta responsável</p>
            <h2 id="escopo-titulo">Organização não é exposição</h2>
          </div>
          <p>O Burgoweb ajuda a organizar e compartilhar informações autorizadas. Não substitui contabilidade, serviços bancários, administradora ou assessoria jurídica.</p>
        </section>
      </main>
      <footer className="site-footer">
        <p>Burgoweb — organização e transparência para a continuidade do condomínio.</p>
      </footer>
    </>
  );
}
