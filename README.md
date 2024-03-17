# Dell IT Academy #20 - Exercício Técnico

Implementação do exercício técnico do programa Dell IT Academy #20 feito pelo aluno de Engenharia de Sofware da PUCRS Eduardo Amengual Garcia.

## Tecnologias utilizadas no projeto

- [Nuxt 3](https://nuxt.com/) = Framework full-stack, facilitando muito o desenvolvimento sem se preocupar com configuração de rotas, servidor, dentre outras coisas
- [Vue.js](https://vuejs.org/) = Framework de front end para criar interfaces de maneira mais eficiente
- [NuxtUI](https://ui.nuxt.com/) = Biblioteca de componentes para completar com a combinação Vue+Nuxt
- [TailwindCSS](https://tailwindcss.com/) = Framework CSS usado junto com NuxtUI
- [Supabase](https://supabase.com/) = BAAS (backend-as-a-service) escolhido para se utilizar o banco de dados postgreSQL sem perder tempo com configurações

## Recomendações

Recomendo baixar essas duas extensões do [VS code](https://code.visualstudio.com/) para ter uma melhor experiência na leitura do código

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Instruções para executar

- Tenha o [Node.js](https://nodejs.org/en) instalado

- Uma vez com o terminal aberto do diretório do projeto, rode o seguinte comando para baixar as dependências do projeto

```bash
# npm
npm install
```

- Uma vez com as dependências baixadas, digite o comando abaixo para ligar o servidor de desenvolvimento localmente na porta `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Importante

para o projeto rodar localmente sem problemas, no arquivo `.env` estão as chaves para realizar a conexão com o projeto criado exclusivamente para a realização deste exercício técnico do Supabase.

Uma vez com o resultado preliminar desta etapa do processo, o projeto será PAUSADO e as variáveis serãoinutilizadas.
