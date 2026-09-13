(()=>{
  function decorateLeaders(){
    document.querySelectorAll('.leader[data-leader]').forEach(button=>{
      if(button.querySelector('img'))return;
      const id=button.dataset.leader;
      const image=document.createElement('img');
      image.src=`../../assets/leaders/${id}.png`;
      image.alt=button.querySelector('b')?.textContent||id;
      image.loading='lazy';
      const copy=document.createElement('span');
      copy.className='leader-copy';
      while(button.firstChild)copy.appendChild(button.firstChild);
      button.append(image,copy);
    });
  }
  decorateLeaders();
  new MutationObserver(decorateLeaders).observe(document.getElementById('setup'),{childList:true,subtree:true});
})();

