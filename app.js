// Naver Blog App Interactive Logic

document.addEventListener('DOMContentLoaded', () => {

  // 1. Post List Drawer Toggle (목록열기 / 목록닫기)
  const btnToggleList = document.getElementById('btnToggleList');
  const postListDrawer = document.getElementById('postListDrawer');

  if (btnToggleList && postListDrawer) {
    btnToggleList.addEventListener('click', () => {
      const isOpen = postListDrawer.classList.toggle('open');
      btnToggleList.classList.toggle('open', isOpen);
      const txtSpan = btnToggleList.querySelector('.txt');
      if (txtSpan) {
        txtSpan.textContent = isOpen ? '목록닫기' : '목록열기';
      }
    });
  }

  // 2. Neighbor Add Modal Setup
  const modalBackdrop = document.getElementById('neighborModal');
  const btnOpenModal1 = document.getElementById('btnOpenNeighborModal');
  const btnOpenModal2 = document.getElementById('btnOpenNeighborModal2');
  const btnCloseModal = document.getElementById('btnCloseNeighborModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const btnSubmitNeighbor = document.getElementById('btnSubmitNeighbor');

  function openModal() {
    if (modalBackdrop) modalBackdrop.classList.add('show');
  }

  function closeModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('show');
  }

  if (btnOpenModal1) btnOpenModal1.addEventListener('click', openModal);
  if (btnOpenModal2) btnOpenModal2.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  if (btnSubmitNeighbor) {
    btnSubmitNeighbor.addEventListener('click', () => {
      closeModal();
      showToast('이웃 신청이 성공적으로 완료되었습니다.');
      // Update buttons text
      if (btnOpenModal1) {
        btnOpenModal1.innerHTML = '✔ 이웃';
        btnOpenModal1.style.backgroundColor = '#f0fdf4';
        btnOpenModal1.style.borderColor = '#16a34a';
      }
    });
  }

  // 3. Category Switching & Filtering Interaction
  const catItems = document.querySelectorAll('.cat-item');
  const currentCategoryTitle = document.getElementById('currentCategoryTitle');
  const postCountNum = document.getElementById('postCountNum');

  catItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      catItems.forEach(c => c.classList.remove('active'));
      item.classList.add('active');

      const catName = item.querySelector('.cat-name') ? item.querySelector('.cat-name').textContent.trim() : '';
      const catKey = item.dataset.cat;

      if (currentCategoryTitle) {
        if (catKey === 'gn8' || catKey === 'observation') {
          currentCategoryTitle.textContent = '관찰 노트 > GN8';
          if (postCountNum) postCountNum.textContent = '6';
          showAllPosts();
        } else if (catKey === 'all') {
          currentCategoryTitle.textContent = '전체보기';
          if (postCountNum) postCountNum.textContent = '6';
          showAllPosts();
        } else {
          currentCategoryTitle.textContent = catName;
          if (postCountNum) postCountNum.textContent = '0';
          hideAllPostsWithMessage(catName);
        }
      }
    });
  });

  // Global Search Input
  const globalSearchInput = document.getElementById('globalSearchInput');
  if (globalSearchInput) {
    globalSearchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const query = globalSearchInput.value.trim().toLowerCase();
        filterPostsByQuery(query);
      }
    });
  }
});

// Helper Functions
function scrollToPost(postId) {
  const target = document.getElementById(postId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.style.transition = 'box-shadow 0.3s ease';
    target.style.boxShadow = '0 0 0 2px #03cf5d';
    setTimeout(() => {
      target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.02)';
    }, 1500);
  }
}

function openNeighborModal() {
  const modalBackdrop = document.getElementById('neighborModal');
  if (modalBackdrop) modalBackdrop.classList.add('show');
}

function copyUrlNotice() {
  showToast('URL이 클립보드에 복사되었습니다.');
}

function showToast(msg) {
  const toast = document.getElementById('toastNotice');
  if (toast) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
}

function toggleSympathy(btn) {
  const countSpan = btn.querySelector('.sympathy-count');
  if (!countSpan) return;

  let count = parseInt(countSpan.textContent, 10) || 0;
  const isLiked = btn.classList.contains('liked');

  if (isLiked) {
    btn.classList.remove('liked');
    countSpan.textContent = count - 1;
  } else {
    btn.classList.add('liked');
    countSpan.textContent = count + 1;
    showToast('공감을 표시했습니다.');
  }
}

function showAllPosts() {
  const posts = document.querySelectorAll('.post-card');
  posts.forEach(p => p.style.display = 'block');
  removeEmptyMessage();
}

function hideAllPostsWithMessage(catName) {
  const posts = document.querySelectorAll('.post-card');
  posts.forEach(p => p.style.display = 'none');
  
  const container = document.getElementById('postsContainer');
  removeEmptyMessage();

  const emptyBox = document.createElement('div');
  emptyBox.id = 'emptyCategoryNotice';
  emptyBox.style.cssText = 'background: #ffffff; border: 1px solid #e5e7eb; padding: 48px; text-align: center; color: #6b7280; font-size: 14px;';
  emptyBox.innerHTML = `<strong>'${catName}'</strong> 카테고리에 등록된 글이 없습니다.`;
  container.appendChild(emptyBox);
}

function removeEmptyMessage() {
  const existingMsg = document.getElementById('emptyCategoryNotice');
  if (existingMsg) existingMsg.remove();
}

function filterPostsByQuery(query) {
  if (!query) {
    showAllPosts();
    return;
  }

  const posts = document.querySelectorAll('.post-card');
  let foundCount = 0;

  posts.forEach(post => {
    const text = post.innerText.toLowerCase();
    if (text.includes(query)) {
      post.style.display = 'block';
      foundCount++;
    } else {
      post.style.display = 'none';
    }
  });

  const postCountNum = document.getElementById('postCountNum');
  if (postCountNum) postCountNum.textContent = foundCount;

  if (foundCount === 0) {
    hideAllPostsWithMessage(`검색어: "${query}"`);
  } else {
    removeEmptyMessage();
  }
}

function initScenarioCanvas() {
  const canvas = document.getElementById('scenario-canvas');
  const slides = [...document.querySelectorAll('.canvas-slide')];
  const indicatorCounter = document.getElementById('indicator-counter');
  const dotsContainer = document.querySelector('#scenario-indicator .pagination-dots');
  if (!canvas || slides.length === 0) return;
  dotsContainer.innerHTML = slides.map((_, index) => `<button class="p-dot${index === 0 ? ' active' : ''}" type="button" data-idx="${index}" aria-label="${index + 1}페이지"></button>`).join('');
  const dots = [...dotsContainer.querySelectorAll('.p-dot')];

  let frame = 0;
  const update = () => {
    const travel = Math.max(canvas.offsetHeight - window.innerHeight, 1);
    const progress = Math.max(0, Math.min(1, (window.scrollY - canvas.offsetTop) / travel));
    const index = Math.min(slides.length - 1, Math.floor(progress * slides.length));
    const inScenario = window.scrollY >= canvas.offsetTop && window.scrollY < canvas.offsetTop + canvas.offsetHeight;
    document.body.classList.toggle('scenario-active', inScenario);
    document.body.classList.toggle('playbook-active', window.scrollY < canvas.offsetTop);
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
    if (indicatorCounter) indicatorCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
  };

  dots.forEach((dot) => dot.addEventListener('click', () => {
    const travel = canvas.offsetHeight - window.innerHeight;
    window.scrollTo({ top: canvas.offsetTop + (Number(dot.dataset.idx) / slides.length) * travel, behavior: 'smooth' });
  }));

  window.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      update();
    });
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

document.addEventListener('DOMContentLoaded', initScenarioCanvas);
