const loadCommentsBtnEl = document.getElementById("load-comments-btn");
const commentsEl = document.getElementById("comments");
const formEl = document.querySelector("#comments-form form");
const commentTitleInputEl = document.getElementById("title");
const commentContentInputEl = document.getElementById("content");

function createCommentsList(comments) {
  const commentsListEl = document.createElement("ol");
  
  for (let comment of comments) {
    const commentItemEl = document.createElement("li");
    commentItemEl.innerHTML = `
      <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.content}</p>
      </article>
    `
    commentsListEl.append(commentItemEl);
  }

  return commentsListEl;
}

loadCommentsBtnEl.addEventListener("click", async function() {
  const postId = loadCommentsBtnEl.dataset.postId;

  // Ajax GET 요청
  const response = await fetch(`/posts/${postId}/comments`);
  const comments = response.json(); // json 파일 디코딩

  if (comments && comments.length > 0) {
    const commentsListEl = createCommentsList(comments);
    commentsEl.innerHTML = "";
    coomentsEl.append(commentsListEl);
  } else {
    commentsEl.children[0].textContent = "댓글이 없습니다.";
  }
});

formEl.addEventListener("submit", async function(event) {
  event.preventDefault();
  const postId = formEl.dataset.postId;

  const enteredTitle = commentTitleInputEl.value;
  const enteredContent = commentContentInputEl.value;
  const comment = { title: enteredTitle, content: enteredContent };

  // Ajax POST 요청
  const response = await fetch(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      "Content-Type": "application/json"
    }
  });
});