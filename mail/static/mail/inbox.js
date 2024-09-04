document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  //Submit Email
  document.querySelector('#compose-form').onsubmit = function() {
    submit_email()
    setInterval(load_mailbox('sent'), 1000);

    return false;
  };
  
  // By default, load the inbox
  setInterval(load_mailbox('inbox'), 1000);
});

function submit_email() {

  //API email submition
  fetch('/emails' , {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.getElementById('compose-recipients').value,
      subject: document.getElementById('compose-subject').value,
      body: document.getElementById('compose-body').value
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
}

function compose_email() {
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  //API get emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    
    // Show the mailbox e-mails
    emails.forEach((each_email, index) => {
      setTimeout(() => {
        fetch(`/emails/${each_email.id}`)
        .then(response => response.json())
        .then(email => {
          console.log(email)
          //Need to finish format each_email
          const element = document.createElement('div');
          element.style.cursor = 'pointer';
          if (email.read === true) {
            element.className = 'email_read email_container';
          }
          else {
            element.className = 'email_container';
          };
          element.innerHTML = `<strong> ${email.sender} </strong> ${email.subject} ${email.timestamp}`;
          element.addEventListener('click', () => {
            read_email(email);
            load_email_page(email);
          });
          document.querySelector('#emails-view').append(element);
        });
      }, index * 50);
    });
  });
}

function load_email_page(email) {
  //hide another views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  //email header
  const email_header = `
  <p><strong>From:</strong> ${email.recipients}</p>
  <p><strong>To:</strong> ${email.sender}</p> 
  <p><strong>Subject:</strong> ${email.subject}</p> 
  <p><strong>Timestamp:</strong> ${email.timestamp}</p>
  `;
  document.querySelector('#emails-view').innerHTML = email_header
  
  //reply button
  const reply_button = document.createElement('button');
  reply_button.innerHTML = 'Reply';
  reply_button.className = 'reply_btn btn btn-sm btn-outline-primary';
  document.querySelector('#emails-view').append(reply_button);

  //line before content
  const end_header = document.createElement('hr');
  document.querySelector('#emails-view').append(end_header);

  //email content
  const email_body = document.createElement('div');
  email_body.className = 'email_body'
  email_body.innerHTML = `${email.body}`
  document.querySelector('#emails-view').append(email_body);

  //reply button redirect to compose
  document.querySelector('.reply_btn').addEventListener('click', compose_email); //need to fill 'to' space with email who sent

  //show the email in the console when it is clicked
  console.log(email);

}

function read_email(email) {
  fetch(`/emails/${email.id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true
    })
  })
}