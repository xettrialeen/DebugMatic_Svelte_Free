<script>
    import { fade, fly } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';

  let visible = false;
  async function activateColorPicker() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'colorPickerActivate' });
    }
  }

  function openShortcutSettings() {
    chrome.tabs.create({url: 'chrome://extensions/shortcuts'});
  }

  setTimeout(() => {
    visible = true;
  }, 100);
</script>

<main class="bg-[#1E1E1E] text-white p-4 w-[303px] h-[274px] flex flex-col">
  <header class="flex justify-between items-center mb-6">
    <h1 class="text-[16px] font-bold">DebugMatic <span class="text-[#DDDDDD] text-[14px] font-normal">Free</span></h1>
 
  </header>
  
  {#if visible}
    <div class="flex-grow flex flex-col items-center justify-center"
         in:fade={{ duration: 300, delay: 150 }}>
      <div class="bg-[#252525] rounded-lg p-6 text-center mb-4"
           in:fly={{ y: 20, duration: 400, delay: 150, easing: elasticOut }}>
        <button 
          on:click={openShortcutSettings}
          class="bg-[#252525] border border-gray-600 rounded px-3 py-1 mb-3 hover:bg-[#3A3A3A] transition-colors duration-200"
        >
          ⌘C
        </button>
        <p class="text-[#C5C5C5] text-[14px]">
          Press Ctrl + Shift + Y to activate
          and deactivate Color picker.
        </p>
      </div>
    </div>
  
    <footer class="text-center text-zinc-200 opacity-60 text-xs"
            in:fade={{ duration: 300, delay: 300 }}>
      Powered by <a target="_blank" class="underline hover:text-white transition-colors duration-200" href="https://www.linkedin.com/company/yashitech">Yashitech Solutions</a>
    </footer>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
  }
</style>