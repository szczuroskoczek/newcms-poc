<script lang="ts">
  export let page: {
    content: { type: string; props: Record<string, any> };
    id: 1;
    layout: "@core-default";
    path: "/";
    title: "Home";
  };

  // any to ignore ts errors
  export let rootComponent: any;
</script>

<svelte:component this={rootComponent} {...page.content.props} />
