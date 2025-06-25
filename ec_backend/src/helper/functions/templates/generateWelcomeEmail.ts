import { ConfigService } from '@nestjs/config';
import ResendObject from '../../../common/types/ResendObject';

export default function generateWelcomeEmail(
  name: string,
  email: string,
  configService: ConfigService,
): ResendObject {
  const template: ResendObject = {
    from: 'Teacher Andrew <teacher.andrew@englishconversations.com.br>',
    to: [email],
    subject: 'Welcome!',
    html: `<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bem-vindo ao English Conversations!</title>
  </head>
  <body style="width: 640px; margin: 0; font-family: Poppins, sans-serif;">
    <div style="width: 100%; height: 150px; background-color: black; border-radius: 0 0 6em 0;">
      <img
        style="width: 100%; height: 100%; object-fit: contain;"
        src="${configService.get<string>('LOGO_URL')}"
        alt="Logo English Conversations"
      />
    </div>
    <div style="padding: 0 3em;">
      <h1 style="text-align: center; color: black">Welcome to the club!</h1>
      <p style="color: black">Olá, ${name.split(' ')[0]}! 👋</p>
      <p style="text-align: justify; color: black">
        Parabéns por dar o primeiro passo rumo à fluência no inglês! É uma
        alegria ter você com a gente no English Conversations, um curso pensado
        para transformar a sua jornada de aprendizado em algo leve, interativo e
        eficiente.
      </p>
      <p style="color: black">Aqui você vai encontrar:</p>
      <ul>
        <li style="color: black">&#9989; Aulas organizadas por níveis, do básico ao avançado!</li>
        <li style="color: black">&#9989; Exercícios práticos, provas, feedbacks de progresso</li>
        <li style="color: black">
          &#9989; Um cronograma pensado para te manter motivado(a) do início ao fim
        </li>
        <li style="color: black">
          &#9989; Suporte e acompanhamento de um professor com anos de experiência
        </li>
      </ul>
      <p style="margin-top: 3em; color: black;">
        ✨ <strong>Seu acesso já está liberado!</strong>
      </p>
      <p style="text-align: justify; color: black">
        Aproveite para explorar os primeiros módulos e começar a estudar hoje
        mesmo. Se tiver qualquer dúvida ou precisar de ajuda, é só responder
        este e-mail. Estou aqui para te acompanhar em cada passo.
      </p>
    </div>
    <div style="background-color: black; border-radius: 0 1em 1em 0; margin-top: 4em;">
      <p
        style="
          padding: 1em 3em;
          color: white;
          font-size: 0.9rem;
        "
      >
        Welcome aboard! 🚀 <br>
        Teacher Andrew <br>
        <a style="color: white; text-decoration: none;" href="${configService.get<string>('FRONTEND_URL')}"
          >englishconversations.com.br</a
        >
      </p>
    </div>
  </body>`,
  };

  return template;
}
