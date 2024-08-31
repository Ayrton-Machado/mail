document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  //Submit Email
  document.querySelector('#compose-form').onsubmit = function() {
    submit_email();
    load_mailbox('sent')

    return false;
  };
  
  // By default, load the inbox
  load_mailbox('inbox');
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
  document.querySelector('#emails-body').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#emails-body').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  //API get emails
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    
    // Show the mailbox e-mails
    emails.forEach(function(each_email) {
      fetch(`emails/${each_email.id}`)
      .then(response => response.json())
      .then(email => {
        console.log(email);
        //Need to add a div to each email, to show correctly in mailbox
        document.querySelector('#emails-body').append("()")
      });
    });
  });
}