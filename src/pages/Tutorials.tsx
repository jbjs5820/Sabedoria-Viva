import React from 'react';
import { Link } from 'react-router-dom';

const tutorials = [
  {
    id: 'primeiro-acesso',
    title: 'Como Criar Sua Conta',
    description: 'Um guia passo a passo para começar a usar a plataforma',
    steps: [
      {
        title: 'Acesse a página inicial',
        content: 'Clique no botão "Comece Sua Jornada Aqui"',
        image: '/tutorial/step1.png'
      },
      {
        title: 'Preencha seus dados',
        content: 'Digite seu email e crie uma senha segura',
        image: '/tutorial/step2.png'
      },
      {
        title: 'Complete seu perfil',
        content: 'Adicione suas informações pessoais e interesses',
        image: '/tutorial/step3.png'
      }
    ]
  },
  {
    id: 'navegacao',
    title: 'Navegando na Plataforma',
    description: 'Aprenda a encontrar tudo que precisa',
    steps: [
      {
        title: 'Menu principal',
        content: 'Conheça as principais seções do site',
        image: '/tutorial/nav1.png'
      },
      {
        title: 'Encontrando eventos',
        content: 'Como descobrir eventos próximos a você',
        image: '/tutorial/nav2.png'
      },
      {
        title: 'Conectando com pessoas',
        content: 'Faça novas amizades com interesses em comum',
        image: '/tutorial/nav3.png'
      }
    ]
  }
];

export default function Tutorials() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Tutoriais Passo a Passo
        </h1>
        
        <div className="space-y-12">
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-4">{tutorial.title}</h2>
              <p className="text-xl text-gray-600 mb-8">{tutorial.description}</p>
              
              <div className="space-y-8">
                {tutorial.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                      <p className="text-lg text-gray-600 mb-4">{step.content}</p>
                      {step.image && (
                        <img
                          src={step.image}
                          alt={step.title}
                          className="rounded-lg shadow-md"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700 transition-colors">
                  Ver Tutorial em Vídeo
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl mb-4">Ainda tem dúvidas?</p>
          <div className="space-x-4">
            <Link
              to="/ajuda"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700 transition-colors"
            >
              Fale Conosco
            </Link>
            <Link
              to="/suporte"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg text-lg border-2 border-purple-600 hover:bg-purple-50 transition-colors"
            >
              Agendar Suporte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}