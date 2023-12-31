import emailjs from '@emailjs/browser';
import { useState, useEffect, useRef } from "react";
import '../css/components/sendEmail.css';
import axios from 'axios';
import logoLinkedin from '../assets/logo-linkedin.png';
import logoGithub from '../assets/icons8-github-50.png';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return () => {};
  }, [delay]);
}

export default function SendEmail() {
  const [fromName, setFromName] = useState('');
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [showWaitMessage, setShowWaitMessage] = useState(false);
  const [countdown, setCountdown] = useState(5); 



  useInterval(() => {
    if (countdown > 0) {
      setCountdown(countdown - 1);
    } else {
      setShowWaitMessage(false);
      setFromName('');
      setText('');
      setEmail('');
    }
  }, showWaitMessage ? 1000 : null);

  const sendEmail = async (event) => {
    try {
      event.preventDefault();
      setShowWaitMessage(true);
      setCountdown(5); 
      
      setTimeout(async () => {
        const message = {
          name: fromName,
          email,
          text,
        }
  
        const templateParams = {
          from_name: fromName,
          message: text,
          email,
        }
    
        const { REACT_APP_SERVICE_ID, REACT_APP_TEMPLATE_ID, REACT_APP_USER_ID } = process.env;
  
      await axios({
        method: 'post',
        url: 'https://deivid-borges-portfolio-backend.onrender.com/save-message',
        data: message
      })
  
      await emailjs.send(
          REACT_APP_SERVICE_ID,
          REACT_APP_TEMPLATE_ID,
          templateParams,
          REACT_APP_USER_ID
        );
      }, 5000);  

    } catch (error) {
      throw error('Erro ao enviar mensagem');
    }
  };

  const getAndCheckValues = () => {
    const submitButton = document.getElementById('send-button');
    const inputName = document.getElementById('user-name');
    const inputEmail = document.getElementById('user-email');
    const inputMessage = document.getElementById('message');

    const { value: name} = inputName;
    const { value: emailValue} = inputEmail;
    const { value: messageValue} = inputMessage;

    const isValid = name.length >= 3 &&
    name !== null &&
    name !== '' &&
    messageValue.length >= 15 &&
    messageValue !== null &&
    messageValue !== '' &&
    emailValue.length >= 6 &&
    emailValue !== null &&
    emailValue !== '' &&
    emailValue.includes('@');

    if (isValid) (submitButton.disabled = false)
    else (submitButton.disabled = true);

    setEmail(emailValue);
    setFromName(name);
    setText(messageValue);
  }

  return (
    <div className="container-contacts" id='content'>
      <div className="div-contatcs">
        <div className="div-send-email">
          <div className="form-div-send-email">
            
            {showWaitMessage
              ? <div className="wait-message"><p>Mensagem enviada! Aguarde {countdown} segundos para enviar outra...</p></div> 
              : <form onSubmit={sendEmail}>
              <p className="form-title">Envie uma mensagem...</p>
              <label htmlFor='user-name' >
                Nome
                <input
                  type="text"
                  name="user-name"
                  id='user-name'
                  onChange={getAndCheckValues}
                  value={fromName}
                  placeholder='Escreva seu nome...'
                  />
              </label>
              <label htmlFor='user-email'>
                Email
                <input
                  type="email"
                  name="user-email"
                  id='user-email'
                  onChange={getAndCheckValues}
                  value={email}
                  placeholder='Escreva seu email...'
                  />
              </label>
              <label htmlFor='message'>
                Mensagem
                <textarea
                  name="message"
                  id='message'
                  onChange={getAndCheckValues}
                  value={text}
                  placeholder='Escreva sua mensagem...'
                  />
              </label>
              <button type="submit" className='send-button' id='send-button' disabled>
                <p className='send-button-icon'>Enviar</p> 
              </button>
            </form> 
              }
            <div className="div-icons">
              <a href='https://www.linkedin.com/in/deivid-borges/' target='blank' className="link-linkedin" rel="noopener noreferrer">
                <img src={logoLinkedin} alt="" className="icons icon-linkedin" />
              </a>
              <a href='https://github.com/DeividBorges93' target='blank' className="link-github" rel="noopener noreferrer">
                <img src={logoGithub} alt="" className="icons icon-github" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}