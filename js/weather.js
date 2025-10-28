/* 툴팁 */
$('.tooltip_btn').click(function () {
	$(this).siblings($('.tool')).css('display', 'block');
});

$('.wrap, .close_btn').click(function () {
	$('.tool').css('display', 'none');
});

$('.tooltip_wrap').click(function (e) {
	e.stopPropagation();
});

/* 위치 즐겨찾기*/
$('.like_btn').click(function () {
	if ($(this).hasClass('active')) {
		$(this).removeClass('active');
		$(this).attr('aria-label', '위치 즐겨찾기');
	} else {
		$(this).addClass('active');
		$(this).attr('aria-label', '위치 즐겨찾기 완료, 위치 즐겨찾기 해제');
	}
});

/* 여러 개 탭 */
$('.tab_wrap, .sub_tab_wrap').each(function () {
	const $tabWrap = $(this);

	$tabWrap.find('button').click(function () {
		$tabWrap.find('button').removeClass('active');
		$(this).addClass('active');
	});

	$tabWrap.find('button').eq(0).trigger('click');
});

/* 시간대별 예보 슬라이드1 */
const swiper1 = new Swiper('.swiper1.swiper', {
	slidesPerView: 'auto',
	spaceBetween: 30,
	loop: false,
	freeMode: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

/* 슬라이드1 넓이별 이동 */
const nextBtn = document.querySelector('.swiper-button-next');
const prevBtn = document.querySelector('.swiper-button-prev');

let wrapperWidth;
let totalSlidesWidth;
let maxTranslate;
let minTranslate;
let currentTranslate = 0;

function calculateWidths() {
	wrapperWidth = swiper1.wrapperEl.offsetWidth;

	totalSlidesWidth = 0;
	swiper1.slides.forEach(slide => {
		totalSlidesWidth += slide.offsetWidth + 15;
	});

	maxTranslate = 0;
	minTranslate = -(totalSlidesWidth - wrapperWidth);
	if (minTranslate > 0) minTranslate = 0;
}

function resetTranslate() {
	currentTranslate = 0;
	swiper1.setTranslate(currentTranslate);
}

nextBtn.addEventListener('click', () => {
	currentTranslate -= wrapperWidth;

	if (currentTranslate < minTranslate) {
		currentTranslate = minTranslate;
	}

	swiper1.setTranslate(currentTranslate);
});

prevBtn.addEventListener('click', () => {
	currentTranslate += wrapperWidth;

	if (currentTranslate > maxTranslate) {
		currentTranslate = maxTranslate;
	}

	swiper1.setTranslate(currentTranslate);
});

/* 주간 예보 슬라이드2 */
const swiper2 = new Swiper('.swiper2.swiper', {
	slidesPerView: 'auto',
	loop: false,
	spaceBetween: 54,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
});

/* 반응형 */
function onResize() {
	calculateWidths();
	resetTranslate();

	if ($(window).innerWidth() <= 767) {
		/* 모바일 탭 */
		$('.mo_tab_wrap > button').off('click').on('click', function () {
			$('.mo_tab_wrap > button').removeClass("active");
			$(this).addClass("active");
			$('.mo_tabcontent').hide();
			$('.mo_tabcontent').eq($(this).index()).show();
		});

		$('.mo_tab_wrap > button').eq(0).trigger("click");

		/* 더보기 */
		$('.group_wrap li.second').css('display', 'none');
		$('.group_wrap li.mo').removeClass('active2').addClass('active1');
		$('.more_btn2').trigger("click");

		$('.more_btn1').click(function () {
			$('.group_wrap li.first').css('display', 'none');
			$('.group_wrap li.second').css('display', 'block');
			$('.group_wrap li.mo').removeClass('active1').addClass('active2');
			$('.group_wrap li.mo .date').text('오늘');
		});

		$('.more_btn2').click(function () {
			$('.group_wrap li.second').css('display', 'none');
			$('.group_wrap li.first').css('display', 'block');
			$('.group_wrap li.mo').removeClass('active2').addClass('active1');
			$('.group_wrap li.mo .date').text('내일');
		});
	} else {
		/* 모바일 탭 */
		$('.mo_tabcontent').show();
		$('.mo_tab_wrap > button').removeClass("active");
		$('.mo_tab_wrap > button').off('click');

		/* 더보기 */
		$('.group_wrap li.first, .group_wrap li.second').css('display', 'block');
	}
}

$(window).resize(onResize).trigger('resize');

/* 미세먼지 지수 그래프 */
const circles = document.querySelectorAll(".donut_graph");

circles.forEach((wrap) => {
	const progressCircle = wrap.querySelector(".progress");
	const progressText = wrap.querySelector(".graph_text");
	const targetPercent = parseInt(wrap.dataset.percent, 10);
	const radius = 54;
	const circumference = 2 * Math.PI * radius;
	let current = 0;

	const setProgress = (percent) => {
		const offset = circumference - (percent / 100) * circumference;
		progressCircle.style.strokeDashoffset = offset;
		progressText.textContent = `${percent}`;
	};

	const animateProgress = () => {
		const interval = setInterval(() => {
			if (current >= targetPercent) {
				clearInterval(interval);
			} else {
				current++;
				setProgress(current);
			}
		}, 10);
	};

	animateProgress();
});

/* 일출일몰 그래프 */
document.querySelectorAll('.sunset_graph').forEach(gauge => {
	const targetProgress = Number(gauge.dataset.progress) /* 100 */ ;
	const fill = gauge.querySelector('.arc-fill');
	const sun = gauge.querySelector('.sun');
	const radius = 90;
	const cx = 100,
		cy = 110;
	const circumference = Math.PI * radius;
	fill.style.strokeDasharray = circumference;
	fill.style.strokeDashoffset = circumference;

	let current = 0;

	const animate = () => {
		if (current <= targetProgress) {
			const progressRatio = current / 100;
			fill.style.strokeDashoffset = circumference * (1 - progressRatio);

			const rad = Math.PI * progressRatio;
			const x = cx + radius * Math.cos(Math.PI - rad);
			const y = cy - radius * Math.sin(Math.PI - rad);
			sun.style.left = `${x + 54}px`;
			sun.style.top = `${y}px`;

			current++;
			requestAnimationFrame(animate);
		}
	};

	animate();
});


/* 반응형 드래그 */
const wraps = document.querySelectorAll('.scroll_x');

wraps.forEach((wrap) => {
	let isDown = false;
	let startX;
	let scrollLeft;

	wrap.addEventListener('mousedown', (e) => {
		isDown = true;
		wrap.classList.add('dragging');
		startX = e.pageX - wrap.offsetLeft;
		scrollLeft = wrap.scrollLeft;
	});

	wrap.addEventListener('mouseleave', () => {
		isDown = false;
		wrap.classList.remove('dragging');
	});

	wrap.addEventListener('mouseup', () => {
		isDown = false;
		wrap.classList.remove('dragging');
	});

	wrap.addEventListener('mousemove', (e) => {
		if (!isDown) return;
		e.preventDefault();
		const x = e.pageX - wrap.offsetLeft;
		const walk = (x - startX) * 1;
		wrap.scrollLeft = scrollLeft - walk;
	});
});