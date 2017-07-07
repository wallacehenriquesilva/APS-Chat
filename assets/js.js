$(document).ready(function(){  
    //Cria a variavel socket já se conectando com o socket.io com o ip e porta definidos por nós.
    var socket = io.connect("http://192.168.43.89:3000");
    var ready = false;

    //Funcão de evento de pressionar o botão enter.
    $("#submit").submit(function(e) {
		e.preventDefault();
		entra();
	});
    
    //Função de entrar
    function entra(){
        //Oculta a div do nome
        $("#nick").fadeOut(); 
        //Exibe as div's das mensagens
		$("#chat").fadeIn();  
        //Cria uma variável nome pegando o valor do nome digitado pelo usuario na div inicial
		var nome = $("#nome").val(); 
        //Cria uma variavel time já instanciando a data, que usaremos para pegar o horário em que o usuário se conectou.
		var time = new Date();
        //Setta o nome do usuário na tela de mensagens
		$("#nome_e").html(nome);
        //Setta o horário em que o usuario se conectou
		$("#acesso").html('Conectado às: ' + time.getHours() + ':' + time.getMinutes());
        
        //Declara como pronto para a conexão
		ready = true;
        //Envia a mensagem ao servidor passado o nome do usuário
		socket.emit("join", nome);
    }

    //Evento de enter no campo de texto
	$("#txtMensagem").keypress(function(e){
        if(e.which == 13) {
            //Chama a função de enviar a mensagem
        	enviaMensagem();
        }
    });
    

    //Função de envio da mensagem
    function enviaMensagem(){
        //Pega o valor do campo txtMensagem e coloca em uma variável que acaba de ser criada
        var text = $("#txtMensagem").val();
        //Setta o valor de vazio '' para o campo de texto
        $("#txtMensagem").val('');
        //Cria uma variavel do tipo date, para pegar o horário de envio da mensagem
        var time = new Date();
        //Cria umm item para a lista de mensagens que serão exibidas, com a mensagem enviada pelo usuario, seu nome, e o horário de envio.
        $(".chat").append('<li class="self"><div class="msg"><span>' + $("#nome").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
        //Envia a mensagem do usuario para o servidor	
        socket.emit("send", text);

    }
    
    //Função de atualização das informações sobre os usuários (Quem se conectou, desconectou)
    socket.on("update", function(msg) { 
        //Verifica se esta conectado
    	if (ready) {
            //Pega a mensagem enviada pelo servidor e exibe na lista de mensagens.
    		$('.chat').append('<li class="info">' + msg + '</li>')
    	}
    }); 
    
    //Função que recebe as mensagens do servidor
    socket.on("chat", function(client,msg) {
        //Verifica se esta conectado
    	if (ready) {
            //Cria a variavel do tipo Date para pegar o horário que recebeu a mensagem
	    	var time = new Date();
            //Recebe a mensagem dos usuários enviadas para o servidor e as exibe, juntamente com o nome do usuário e o horário
	    	$(".chat").append('<li class="other"><div class="msg"><span>' + client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
    	
        }
    });





});

