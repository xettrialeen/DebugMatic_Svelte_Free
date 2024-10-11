<script>
    let count = 0;
    
    function incrementCount() {
      count += 1;
    }
  </script>
  
  <main>
    <h1>Welcome to my Svelte Chrome Extension!</h1>
    <p>You clicked {count} times.</p>
    <button on:click={incrementCount}>
      Click me
    </button>
  </main>
  
  <style>
    main {
      text-align: center;
      padding: 1em;
      max-width: 240px;
      margin: 0 auto;
    }
    h1 {
      color: #ff3e00;
      font-size: 4em;
      font-weight: 100;
    }
  </style>