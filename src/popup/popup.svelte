<script>
  let count = 0;
  
  async function incrementCount() {
    count += 1;
    
    // Send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'incrementCount', count });
    }
  }
</script>

<main class="p-4 max-w-sm mx-auto">
  <h1 class="text-2xl font-bold text-blue-600 mb-4">Welcome to my Svelte Chrome Extension!</h1>
  <p class="mb-4">You clicked {count} times.</p>
  <button 
    on:click={incrementCount}
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    Click me
  </button>
</main>