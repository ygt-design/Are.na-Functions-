let auth = "add your auth here";
// get it from: https://arena-token-gen.vercel.app/";

fetch("https://api.are.na/v2/channels/1510013?per=100&page=1").then((res) => {
  res.json().then((data) => {
    console.log(data);
    data.contents.forEach((content) => {
      document.body.innerHTML += `<p>${content.position} .${content.title}</p>`;
    });
  });
});

body = {
  title: "My new channel",
  status: "public",
};

fetch("https://api.are.na/v2/channels/", {
  headers: {
    Authorization: "Bearer " + auth,
    method: "POST",
    body: JSON.stringify(body),
  },
}).then((res) => {
  res.json().then((data) => {
    console.log(data);
  });
});

//
//
// API functions
const get_channel = async (slug) => {
  return await fetch(`https://api.are.na/v2/channels/${slug}?per=100`, {
    headers: {
      Authorization: `Bearer ${auth}`,
      cache: "no-store",
      "Cache-Control": "max-age=0, no-cache",
      referrerPolicy: "no-referrer",
    },
  })
    .then((response) => response.json())
    .then((data) => data);
};

const add_block = (slug, title, content) => {
  console.log(slug, title, content);
  fetch("https://api.are.na/v2/channels/" + slug + "/blocks", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    },
    method: "POST",
    body: JSON.stringify({
      content: content,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // cant create a block with title, so we update it
      let block_id = data.id;
      update_block(block_id, { title: title });
    });
};

const update_block = (block_id, body, fuck = false) => {
  fetch(`https://api.are.na/v2/blocks/${block_id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    },
    method: "PUT",
    body: JSON.stringify(body),
  }).then(() => {
    if (fuck) {
      // when you update a block it doesn't mark the channel as updated and returns a stale request
      // so  we add and delete a block to mark it as updated, thats fuck refresh
      fuck_refresh("calendar-test");
    } else {
      refresh_journal();
    }
  });
};

const delete_block = (slug, id) => {
  fetch("https://api.are.na/v2/channels/" + slug + "/blocks/" + id, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    },
    method: "DELETE",
  }).then((res) => {
    console.log(res);
    refresh_journal();
  });
};

const fuck_refresh = (slug) => {
  fetch("https://api.are.na/v2/channels/" + slug + "/blocks", {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth,
    },
    method: "POST",
    body: JSON.stringify({
      content: "temp",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      let block_id = data.id;
      delete_block(slug, block_id);
    });
};
