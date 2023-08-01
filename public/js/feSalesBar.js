document.getElementById('show-more-btn').addEventListener('click', function() {
    const moreDeals = document.querySelectorAll('.sale-item:nth-child(n+6)');
    moreDeals.forEach(deal => {
      deal.classList.toggle('hidden-deal');
    });
    this.textContent = this.textContent === 'Show More' ? 'Show Less' : 'Show More';
  });
  