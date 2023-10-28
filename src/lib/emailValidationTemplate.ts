export function emailValidationTemplate(verifyUrl: string) {
  return `<div style="background-color: #EE4B1F; padding: 20px; font-family: Poppins, Arial, sans-serif;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 4px;">
      <img src="http://localhost:3000/Logo.svg" alt="Rotina Monetária" style="display: block; width: 150px; margin: 10px auto;">
        <h2 style="color: #1E1E1E; text-align: center;">Verificação de E-mail</h2>
        <p style="font-size: 16px; color: #333; text-align: center;">
          Olá, seja bem-vindo a sua Rotina Monetária. Para finalizar o seu cadastro, clique no link abaixo para validar seu e-mail e começar a gerenciar suas finanças.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #EE4B1F; color: #fff; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
            Validar E-mail
          </a>
        </div>
      </div>
    </div>`
}
