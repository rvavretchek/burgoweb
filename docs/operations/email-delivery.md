# Entrega de e-mail transacional

O worker de verificação usa Brevo como provedor primário e Resend como contingência configurável. Aceite da API significa somente que o provedor recebeu a mensagem para processamento; não representa entrega na caixa postal.

Antes de habilitar o worker em produção:

- configurar e validar SPF, DKIM e DMARC no domínio do remetente;
- fornecer as credenciais de menor privilégio apenas por variáveis runtime;
- confirmar que tracking de abertura e clique permanece desabilitado nos provedores;
- configurar a origem HTTPS pública, TTL, lease e máximo de tentativas;
- monitorar itens `dead` e `ambiguous` sem registrar destinatário, conteúdo ou token;
- tratar resultado ambíguo por reconciliação operacional, nunca por reenvio automático cego.

Em desenvolvimento, `BURGOWEB_EMAIL_WORKER_DISABLED=true` mantém o processo independente orquestrado sem declarar entregas falsas nem exigir credenciais externas.
