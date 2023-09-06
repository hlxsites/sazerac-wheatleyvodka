export default function decorate(block) {
  block.innerHTML = `
  <picture class="mobile">
      <source type="image/webp" srcset="./media_146775dcc1a0f644d54e8f00e8d223b0e49b3fd65.png?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="./media_146775dcc1a0f644d54e8f00e8d223b0e49b3fd65.png?width=750&amp;format=webply&amp;optimize=medium">
      <source type="image/png" srcset="./media_146775dcc1a0f644d54e8f00e8d223b0e49b3fd65.png?width=2000&amp;format=png&amp;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="" src="./media_146775dcc1a0f644d54e8f00e8d223b0e49b3fd65.png?width=750&amp;format=png&amp;optimize=medium" width="1129" height="1213">
    </picture>
  <picture class="desktop">
      <source type="image/webp" srcset="./media_19259e012ae71de2fc4382102cdc78354f373c7e6.png?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
      <source type="image/webp" srcset="./media_19259e012ae71de2fc4382102cdc78354f373c7e6.png?width=750&amp;format=webply&amp;optimize=medium">
      <source type="image/png" srcset="./media_19259e012ae71de2fc4382102cdc78354f373c7e6.png?width=2000&amp;format=png&amp;optimize=medium" media="(min-width: 600px)">
      <img loading="lazy" alt="" src="./media_19259e012ae71de2fc4382102cdc78354f373c7e6.png?width=750&amp;format=png&amp;optimize=medium" width="4321" height="1950">
    </picture>
  <div class="buy-wood-panel">
    <div class="title">Get Wheatley delivered to your doorstep</div>
    <div class="buttons">
      <a class="button" href="https://drizly.com/liquor/vodka/wheatley-vodka/p35302" target="_blank">Buy Online<span/></a>
      <br>
      <a class="locator" href="/locator">Product Locator<span/></a>
    </div>
  </div>
  `;
}
