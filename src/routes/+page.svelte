<script lang="ts">
  import { settingsStore } from '$lib/stores/settings';
  
  // Quick action buttons with icons and descriptions
  const quickActions = [
    {
      title: 'Start Register',
      description: 'Open the cash register to start selling',
      icon: '🏪',
      href: '/register',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Products',
      description: 'Add or edit products in your store',
      icon: '📦',
      href: '/inventory',
      color: 'bg-green-500'
    },
    {
      title: 'Settings',
      description: 'Change your store settings',
      icon: '⚙️',
      href: '/settings',
      color: 'bg-purple-500'
    }
  ];

  // Stats - these would typically come from a store or database
  // For now, they're static but we can make them dynamic later
  const stats = [
    {
      title: 'Products',
      value: '0',
      icon: '📦'
    },
    {
      title: 'Sales Today',
      value: '€0.00',
      icon: '💶'
    },
    {
      title: 'Transactions',
      value: '0',
      icon: '🧾'
    }
  ];
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
  <!-- Welcome Section -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold mb-4">
      Welcome to {$settingsStore.storeName}!
    </h1>
    <p class="text-xl text-gray-600">
      What would you like to do today?
    </p>
  </div>

  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    {#each quickActions as action}
      <a
        href={action.href}
        class="group block p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white border-2 border-transparent hover:border-blue-200"
      >
        <div class="flex items-center mb-4">
          <div class={`${action.color} text-white p-3 rounded-lg text-2xl`}>
            {action.icon}
          </div>
          <h2 class="text-xl font-semibold ml-4 group-hover:text-blue-500 transition-colors">
            {action.title}
          </h2>
        </div>
        <p class="text-gray-600">
          {action.description}
        </p>
      </a>
    {/each}
  </div>

  <!-- Stats Overview -->
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-semibold mb-6">Store Overview</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each stats as stat}
        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
          <div class="text-3xl mr-4">
            {stat.icon}
          </div>
          <div>
            <h3 class="text-gray-600">{stat.title}</h3>
            <p class="text-2xl font-bold">{stat.value}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Getting Started Guide -->
  <div class="mt-12 bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-semibold mb-6">Getting Started</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-blue-50 p-6 rounded-lg">
        <h3 class="text-lg font-semibold mb-4">First Time? Here's what to do:</h3>
        <ol class="list-decimal list-inside space-y-3 text-gray-700">
          <li>Go to Settings and set up your store name</li>
          <li>Add some products to your inventory</li>
          <li>Open the register to start selling</li>
          <li>Start scanning products or enter them manually</li>
        </ol>
      </div>
      <div class="bg-yellow-50 p-6 rounded-lg">
        <h3 class="text-lg font-semibold mb-4">Tips:</h3>
        <ul class="list-disc list-inside space-y-3 text-gray-700">
          <li>Use the scanner for faster checkout</li>
          <li>Print receipts for your customers</li>
          <li>Keep track of your inventory</li>
          <li>Have fun running your store! 🎉</li>
        </ul>
      </div>
    </div>
  </div>
</div>
