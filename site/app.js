// Welleast Studio storefront MVP. All product data lives in products.json.
(() => {
  const I18N = {
    en: {
      previewBar: "Preview store · Prices shown are examples · Orders are inquiries — no payment is taken on this site",
      navShop: "Shop", navDetails: "Details", navOrder: "Order",
      eyebrow: "New season · Limited stock",
      heroTitle: "Chunky Runner.<br>{n} colorways.",
      heroLead: "A sculpted, cushioned sole and breathable mesh upper. Pick your colorway, tell us your size, and we'll confirm availability.",
      ctaShop: "Browse colorways", ctaOrder: "Send an inquiry",
      shopTitle: "Choose your colorway",
      shopSub: "Tap a shoe to select it. Images are AI-enhanced renders of the lineup; actual product may vary slightly.",
      d1t: "Sculpted sole", d1p: "Chunky, cut-out midsole for a bold silhouette.",
      d2t: "Mesh upper", d2p: "Layered mesh and overlays. Full materials list: to be confirmed.",
      d3t: "Ships from NYC",
      orderTitle: "Order inquiry",
      orderSub: "No payment is collected here. We'll reply to confirm size, stock, final price and shipping.",
      fColor: "Colorway", fSize: "Size", fQty: "Quantity", fName: "Name", fEmail: "Email",
      fPhone: "Phone / WeChat (optional)", fNote: "Notes (wholesale? pickup in NYC?)", fSubmit: "Send inquiry",
      footNote: 'Unbranded footwear. Not affiliated with or endorsed by any other brand. Prices marked "Example price" are placeholders.',
      selectOrder: "Select & order", all: "All", example: "Example price", priceTbd: "Price on request",
      soldOut: "Unavailable", fam: { black: "Black", white: "White", grey: "Grey", blue: "Blue", green: "Green", neutral: "Neutral", red: "Red" },
      sending: "Sending…", sent: "Thanks! Your inquiry was sent. We'll reply by email.",
      mailOpened: "Your email app should open with the inquiry filled in. If not, email us at {e}.",
      invalid: "Please fill in colorway, size, name and a valid email.", failed: "Couldn't send. Please email us at {e}.",
      line: "Chunky Runner", lang: "中文"
    },
    zh: {
      previewBar: "预览版店铺 · 价格为示例 · 下单为询价，本站不收款",
      navShop: "选购", navDetails: "细节", navOrder: "下单",
      eyebrow: "新季 · 限量库存",
      heroTitle: "老爹厚底跑鞋<br>{n} 种配色",
      heroLead: "雕塑感缓震厚底，透气网面鞋身。选好配色和尺码，我们会回复确认库存。",
      ctaShop: "浏览配色", ctaOrder: "提交询价",
      shopTitle: "选择你的配色",
      shopSub: "点击鞋子即可选择。图片为 AI 优化渲染图，实物可能略有差异。",
      d1t: "雕塑感鞋底", d1p: "镂空厚底，轮廓有型。",
      d2t: "网面鞋身", d2p: "多层网布拼接。完整材质信息：待确认。",
      d3t: "纽约发货",
      orderTitle: "询价下单",
      orderSub: "本站不收款。我们会回复确认尺码、库存、最终价格和运费。",
      fColor: "配色", fSize: "尺码", fQty: "数量", fName: "姓名", fEmail: "邮箱",
      fPhone: "电话 / 微信（选填）", fNote: "备注（批发？纽约自提？）", fSubmit: "提交询价",
      footNote: "无品牌鞋款，与任何其他品牌无关联、无背书。标注“示例价”的价格为占位。",
      selectOrder: "选择并下单", all: "全部", example: "示例价", priceTbd: "价格待询",
      soldOut: "暂不可售", fam: { black: "黑色", white: "白色", grey: "灰色", blue: "蓝色", green: "绿色", neutral: "大地色", red: "红色" },
      sending: "发送中…", sent: "已提交！我们会通过邮件回复你。",
      mailOpened: "邮件应用应已打开并填好询价内容。如果没有，请发邮件到 {e}。",
      invalid: "请填写配色、尺码、姓名和有效邮箱。", failed: "发送失败，请直接发邮件到 {e}。",
      line: "老爹厚底跑鞋", lang: "EN"
    }
  };
  const $ = (s, r = document) => r.querySelector(s);
  const qLang = new URLSearchParams(location.search).get("lang");
  let lang = (qLang === "zh" || qLang === "en") ? qLang : localStorage.getItem("lang") || ((navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en");
  let data = null, filter = "all", selected = null, selectedSize = null;
  const t = (k) => I18N[lang][k];

  function money(p) {
    const cur = data.store.currency || "USD";
    if (p.price != null) return { text: fmt(p.price, cur), tag: "" };
    if (p.examplePrice != null) return { text: fmt(p.examplePrice, cur), tag: t("example") };
    return { text: t("priceTbd"), tag: "" };
  }
  const fmt = (v, cur) => new Intl.NumberFormat(lang === "zh" ? "zh-CN" : "en-US", { style: "currency", currency: cur }).format(v);
  const name = (p) => `${t("line")} — ${p.colorway[lang] || p.colorway.en}`;

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = t(el.dataset.i18n); if (v == null) return;
      el.innerHTML = v.replace("{n}", data ? data.products.length : "");
    });
    $("#langBtn").textContent = t("lang");
    if (data) { $("#shipNote").textContent = data.store.shippingNote[lang]; renderChips(); renderGrid(); renderForm(); }
  }

  function renderChips() {
    const fams = ["all", ...new Set(data.products.map((p) => p.family))];
    $("#chips").innerHTML = fams.map((f) => `<button class="chip" role="tab" aria-selected="${f === filter}" data-f="${f}">${f === "all" ? t("all") : t("fam")[f] || f}</button>`).join("");
  }
  function renderGrid() {
    const list = data.products.filter((p) => filter === "all" || p.family === filter);
    $("#grid").innerHTML = list.map((p) => {
      const m = money(p);
      return `<button class="card ${selected === p.id ? "selected" : ""}" data-id="${p.id}">
        <img src="${p.image}" alt="${name(p)}" loading="lazy" width="600" height="600">
        <h3>${p.colorway[lang] || p.colorway.en}</h3>
        <p class="price">${p.available ? m.text : t("soldOut")}${p.available && m.tag ? `<span class="tag">${m.tag}</span>` : ""}</p>
      </button>`;
    }).join("");
  }
  function renderForm() {
    const sel = $("#fColorway");
    sel.innerHTML = data.products.filter((p) => p.available).map((p) => `<option value="${p.id}" ${p.id === selected ? "selected" : ""}>${p.id} · ${p.colorway[lang] || p.colorway.en}</option>`).join("");
    if (!selected && sel.value) selected = sel.value;
    renderSizes();
  }
  function renderSizes() {
    const p = data.products.find((x) => x.id === $("#fColorway").value) || data.products[0];
    $("#fSize").innerHTML = p.sizes.map((s) => `<option ${s === selectedSize ? "selected" : ""}>${s}</option>`).join("");
  }
  function openSheet(id) {
    const p = data.products.find((x) => x.id === id); if (!p) return;
    selected = id; selectedSize = null;
    $("#sheetImg").src = p.image; $("#sheetImg").alt = name(p);
    $("#sheetTitle").textContent = name(p);
    const m = money(p);
    $("#sheetPrice").innerHTML = m.text + (m.tag ? `<span class="tag">${m.tag}</span>` : "");
    $("#sheetSizes").innerHTML = p.sizes.map((s) => `<button class="size" aria-pressed="false" data-s="${s}">${s}</button>`).join("");
    $("#sheetOrder").disabled = !p.available;
    $("#sheet").hidden = false; renderGrid();
  }
  const closeSheet = () => { $("#sheet").hidden = true; };

  async function submit(e) {
    e.preventDefault();
    const f = e.target, fd = new FormData(f), st = $("#formStatus");
    const email = data.store.email;
    if (!fd.get("colorway") || !fd.get("size") || !fd.get("name") || !/^\S+@\S+\.\S+$/.test(fd.get("email") || "")) { st.textContent = t("invalid"); return; }
    const p = data.products.find((x) => x.id === fd.get("colorway"));
    const summary = `Order inquiry — ${p.id} ${p.colorway.en} (${p.sku})\nSize: ${fd.get("size")}\nQty: ${fd.get("quantity")}\nName: ${fd.get("name")}\nEmail: ${fd.get("email")}\nPhone/WeChat: ${fd.get("contact") || "-"}\nNotes: ${fd.get("message") || "-"}`;
    // TODO: set store.formspreeId in products.json (free account at formspree.io) to receive inquiries without a mail app.
    if (data.store.formspreeId) {
      st.textContent = t("sending");
      try {
        fd.append("_subject", `Inquiry: ${p.id} ${fd.get("size")} x${fd.get("quantity")}`); fd.append("summary", summary);
        const r = await fetch(`https://formspree.io/f/${data.store.formspreeId}`, { method: "POST", body: fd, headers: { Accept: "application/json" } });
        if (!r.ok) throw new Error(r.status);
        st.textContent = t("sent"); f.reset(); renderForm();
      } catch { st.textContent = t("failed").replace("{e}", email); }
    } else {
      location.href = `mailto:${email}?subject=${encodeURIComponent(`Inquiry: ${p.id} ${fd.get("size")} x${fd.get("quantity")}`)}&body=${encodeURIComponent(summary)}`;
      st.textContent = t("mailOpened").replace("{e}", email);
    }
  }

  document.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip"); if (chip) { filter = chip.dataset.f; renderChips(); renderGrid(); return; }
    const card = e.target.closest(".card"); if (card) { openSheet(card.dataset.id); return; }
    const size = e.target.closest(".size"); if (size) { document.querySelectorAll(".size").forEach((b) => b.setAttribute("aria-pressed", b === size)); selectedSize = size.dataset.s; return; }
    if (e.target.id === "sheet" || e.target.id === "sheetClose") closeSheet();
    if (e.target.id === "sheetOrder") { closeSheet(); renderForm(); $("#fColorway").value = selected; renderSizes(); location.hash = "order"; }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });
  $("#fColorway").addEventListener("change", (e) => { selected = e.target.value; selectedSize = null; renderSizes(); renderGrid(); });
  $("#orderForm").addEventListener("submit", submit);
  $("#langBtn").addEventListener("click", () => { lang = lang === "en" ? "zh" : "en"; localStorage.setItem("lang", lang); applyI18n(); });
  $("#yr").textContent = new Date().getFullYear();

  fetch("products.json", { cache: "no-cache" }).then((r) => r.json()).then((d) => { data = d; document.title = `${d.store.name} — ${I18N.en.line}, ${d.products.length} Colorways`; applyI18n(); })
    .catch(() => { $("#grid").textContent = "Could not load products.json"; });
  applyI18n();
})();
