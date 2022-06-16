let modalQuantidade = 1; 
let cart = [];
let modalId = 0;

const dqs = (el) => document.querySelector(el);
const qsall = (el) => document.querySelectorAll(el);

pizzaJson.map((item, index)=> {
	let pizzaItem = dqs('.models .pizza-item').cloneNode(true);
	
	//Adicionar setAttribute para saber a posição de cada pizza/suas informações
	pizzaItem.setAttribute('data-key', index);

	//Preenchendo as informações da Pizza:
	pizzaItem.querySelector('.pizza-item--img').innerHTML = `<img src = "${item.img}"/>`;
	pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
	pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

// ------------------------------------------------------------------------------------------------------------ //
	//Evento de clique para abrir o modal 
	pizzaItem.querySelector('a').addEventListener('click', (e)=>{
		e.preventDefault();
		let id = e.target.closest('.pizza-item').getAttribute('data-key');
		modalQuantidade = 1;
		modalId = id;

		//Preenchendo dentro do modal as informações da pizza selecionada
		dqs('.pizzaBig img').src = pizzaJson[id].img;
		dqs('.pizzaInfo h1').innerHTML = pizzaJson[id].name;
		dqs('.pizzaInfo--desc').innerHTML = pizzaJson[id].description;
		dqs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[id].price.toFixed(2)}`;

		//Remover o selected do elemento e exibir quando o modal abrir 
		dqs('.pizzaInfo--size.selected').classList.remove('selected');

		//Exibir gramas de cada cartegoria de pizzas e deixar o tamanho grande
		qsall('.pizzaInfo--size').forEach((size, sizeIndex)=>{
			if(sizeIndex == 2){
				size.classList.add('selected');
				let valorGrande = (parseFloat(pizzaJson[id].price) + 30.00).toFixed(2);
				dqs('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorGrande}`;
			}
			size.querySelector('span').innerHTML = pizzaJson[id].sizes[sizeIndex];
		});

		//Mudar o valor da pizza, caso eu mude o tamanho dela
		dqs('.pizzaInfo--sizes').addEventListener('click', ()=>{
			let tamanho = dqs('.pizzaInfo--size.selected').getAttribute('data-key');
			if (tamanho == 0){
				let valorPequena = pizzaJson[id].price.toFixed(2);
				dqs('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorPequena}`;
			} else {
			if (tamanho == 1){
				let valorMedia = (parseFloat(pizzaJson[id].price) + 15.00).toFixed(2);
				dqs('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorMedia}`;
			} else {
				if(tamanho == 2){
					let valorGrande = (parseFloat(pizzaJson[id].price) + 30.00).toFixed(2);
					dqs('.pizzaInfo--actualPrice').innerHTML = `R$ ${valorGrande}`;
				}
			}
		}
	});

		dqs('.pizzaInfo--qt').innerHTML = modalQuantidade;

		dqs('.pizzaWindowArea').style.opacity = 0;
		dqs('.pizzaWindowArea').style.display = 'flex';
		setTimeout(()=>{
			dqs('.pizzaWindowArea').style.opacity = 1;
		}, 400)
	})


	dqs('.pizza-area').append(pizzaItem);
});

// ------------------------------------------------------------------------------------------------------------ //

//Eventos do Modal 
function closeModal(){
	dqs('.pizzaWindowArea').style.opacity = 0;
	setTimeout(()=>{
		dqs('.pizzaWindowArea').style.display = 'none';
	}, 500)
}

qsall('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
	item.addEventListener('click', closeModal);
});

//Botões de + e - para aumentar ou diminuir a quantidade e também alterar o valor
dqs('.pizzaInfo--qtmais').addEventListener('click', ()=>{
	modalQuantidade++;
	dqs('.pizzaInfo--qt').innerHTML = modalQuantidade;
});

dqs('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
	if(modalQuantidade > 1){
		modalQuantidade--;
		dqs('.pizzaInfo--qt').innerHTML = modalQuantidade;
	}
});



//Botão para alternar tamanhos das pizzas
qsall('.pizzaInfo--size').forEach((size, sizeIndex)=>{
	size.addEventListener('click', (e)=>{
		dqs('.pizzaInfo--size.selected').classList.remove('selected');
		size.classList.add('selected');
	});
});

//Adicionar ao carrinho 
dqs('.pizzaInfo--addButton').addEventListener('click', ()=>{
	//reunir informações como: tipo de pizza, tamanho e quantidade
	let size = dqs('.pizzaInfo--size.selected').getAttribute('data-key');

	let identifier = pizzaJson[modalId].id+'@'+size
	let key = cart.findIndex((item)=> item.identifier == identifier);

	if(key > -1){
		cart[key].quantidade += modalQuantidade;
	}else{

		cart.push({
			identifier,
			id:pizzaJson[modalId].id,
			size,
			quantidade: modalQuantidade
		});
	}

	closeModal();
	updateCart();
});

// ------------------------------------------------------------------------------------------------------------ //

//Função para abrir carrinho mobile
dqs('.menu-openner').addEventListener('click', () => {
	if(cart.length > 0){
		dqs('aside').style.left = '0';
	}
});

//Acionando a função para fechar o carrinho no mobile 
dqs('.menu-closer').addEventListener('click', () => {
	dqs('aside').style.left = '100vw';
});

// Exibir o carrinho de compras, se tiver alguma coisa no carrinho, ele vai abrir um modal 
function updateCart(){
	dqs('.menu-openner span').innerHTML = cart.length;

	if(cart.length > 0){
		dqs('aside').classList.add('show');
		dqs('.cart').innerHTML = '';

		//Variáveis que serão usadas no cálculo total do valor
		let subtotal = 0;
		let desconto = 0;
		let total = 0;

		for(let i in cart){
			let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

			subtotal =+ pizzaItem.price * cart[i].quantidade;

			let cartItem = dqs('.models .cart--item').cloneNode(true);

			let pizzaSizeName;
			//switch para atribuir o nome dos tamanhos 
			switch(cart[i].size){
				case '0':
					pizzaSizeName = 'P';
					break;

				case '1':
					pizzaSizeName = 'M';
					break;

				case '2':
					pizzaSizeName = 'G';
					break;
				}

				let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

				//Exibindo os itens na tela do carrinho
				cartItem.querySelector('img').src = pizzaItem.img;
				cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
				cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantidade;
				//Botão para diminuir a quantidade
				cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
					if(cart[i].quantidade > 1){
						cart[i].quantidade--;
					} else {
						cart.splice(i, 1);

					}
					updateCart();
				});
				//Botão para aumentar a quantidade
				cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
					cart[i].quantidade++;
					updateCart();
				});

				dqs('.cart').append(cartItem);
			}

			desconto = subtotal * 0.1;
			total = subtotal - desconto;

			dqs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
			dqs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
			dqs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

		} else {

		dqs('aside').classList.remove('show');
		dqs('aside').style.left = '100vw';
	}
}
