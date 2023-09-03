export function resetPasswordTemplate(resetUrl: string) {
  return `<div style="background-color: #EE4B1F; padding: 20px; font-family: Poppins, Arial, sans-serif;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 4px;">
      <img src="http://localhost:3000/Logo.svg" alt="Rotina Monetária" style="display: block; width: 150px; margin: 10px auto;">
        <h2 style="color: #1E1E1E; text-align: center;">Redefinição de Senha</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Parece que você solicitou uma redefinição de senha. Clique no link abaixo para redefinir sua senha.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #EE4B1F; color: #fff; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
            Redefinir Senha
          </a>
        </div>
      </div>
    </div>`;
}
