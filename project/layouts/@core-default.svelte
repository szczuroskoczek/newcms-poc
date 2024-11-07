<script lang="ts">
  export let page: {
    content: { type: string; props: Record<string, any> };
    id: number;
    layout: string;
    path: string;
    title: string;
  };

  // any to ignore ts errors
  export let rootComponent: any;
</script>

<svelte:head>
  <title>{page.title}</title>
</svelte:head>

<svelte:component this={rootComponent} {...page.content.props} />
