document.addEventListener('DOMContentLoaded', function () {
    const carrosselInner = document.querySelector('.carrossel-inner');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Duplicar os itens para criar efeito infinito
    const items = document.querySelectorAll('.categoria-item');
    const itemsArray = Array.from(items);
    const duplicatedItems = itemsArray.concat(itemsArray);

    // Limpar e adicionar itens duplicados
    carrosselInner.innerHTML = '';
    duplicatedItems.forEach(item => {
        carrosselInner.appendChild(item.cloneNode(true));
    });

    const categoriaItems = document.querySelectorAll('.categoria-item');
    const itemWidth = categoriaItems[0].offsetWidth + 20; // Largura do item + gap
    let scrollAmount = 0;
    const scrollStep = itemWidth * 2; // Move 2 itens por vez
    const totalWidth = itemWidth * itemsArray.length;

    // Ajustar scroll para posição inicial (cópia dos primeiros itens)
    carrosselInner.scrollLeft = 0;

    // Botão anterior
    prevBtn.addEventListener('click', function () {
        scrollAmount -= scrollStep;
        if (scrollAmount < 0) {
            // Transição suave para o final quando chegar no início
            carrosselInner.scrollTo({
                left: totalWidth * 2 - carrosselInner.clientWidth,
                behavior: 'auto'
            });
            scrollAmount = totalWidth * 2 - carrosselInner.clientWidth - scrollStep;
        }

        carrosselInner.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Próximo botão
    nextBtn.addEventListener('click', function () {
        scrollAmount += scrollStep;
        const maxScroll = totalWidth * 2 - carrosselInner.clientWidth;

        if (scrollAmount > maxScroll) {
            // Transição suave para o início quando chegar no final
            carrosselInner.scrollTo({
                left: 0,
                behavior: 'auto'
            });
            scrollAmount = scrollStep;
        }

        carrosselInner.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Autoplay lento (7 segundos por transição)
    let autoplayInterval = setInterval(function () {
        scrollAmount += itemWidth / 2; // Movimento mais lento (metade da velocidade)
        const maxScroll = totalWidth * 2 - carrosselInner.clientWidth;

        if (scrollAmount > maxScroll) {
            // Reset suave para posição inicial
            carrosselInner.scrollTo({
                left: 0,
                behavior: 'auto'
            });
            scrollAmount = itemWidth / 2;
        }

        carrosselInner.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }, 3000); // Ajuste este valor para mudar a velocidade

    // Pausar no hover
    carrosselInner.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carrosselInner.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            scrollAmount += itemWidth / 2;
            const maxScroll = totalWidth * 2 - carrosselInner.clientWidth;

            if (scrollAmount > maxScroll) {
                carrosselInner.scrollTo({
                    left: 0,
                    behavior: 'auto'
                });
                scrollAmount = itemWidth / 2;
            }

            carrosselInner.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }, 3000);
    });

    // Resetar posição quando chegar perto do final (para transição invisível)
    carrosselInner.addEventListener('scroll', function () {
        const maxScroll = totalWidth * 2 - carrosselInner.clientWidth;
        if (carrosselInner.scrollLeft >= maxScroll - 10) {
            setTimeout(() => {
                carrosselInner.scrollTo({
                    left: 0,
                    behavior: 'auto'
                });
                scrollAmount = 0;
            }, 100);
        }
    });
});