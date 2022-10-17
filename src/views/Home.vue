<template>
  <div class="container">
    <div class="card">
      <Navigation class="nav"
        @newMessage="state.activePage == 'newMessage' ? state.activePage = 'default' : state.activePage = 'newMessage'"
        @resetView="resetView" />
      <div id="midContainer">
        <div class="contentPanel scrollContainer">
          <div class="content scrollContainer">
            <div class="body">
              <span class="alert" v-if="state.alert != ''" v-html="state.alert" />
              <div class="replyToContainer"
                v-if="state.currentReplyTo && state.currentReplyTo >= 0 && state.activePage == 'star'">
                <span class="replyLabel" @click="openReply(state.currentReplyTo)">Star #{{
                    state.currentReplyTo
                }}</span>
                <div id="replyToText" class="replyToText" :style="{
                  background: state.replyStarColor,
                  cursor: state.expandReply ? 'zoom-out' : 'zoom-in',
                  maxHeight: state.expandReply ? 'none' : '5rem',
                  WebkitLineClamp: state.expandReply ? 'unset' : 4
                }" @click="state.expandReply = !state.expandReply">
                  {{ state.replyText }}
                </div>
              </div>
              <Default v-if="state.activePage == 'default'" />
              <ArticleFeed v-if="state.activePage == 'default'" @selectArticle="openArticle" />
              <div class="activeArticle" v-if="state.activePage == 'article'">
                <h3>{{ state.activeArticle.title }}</h3>
                <p>{{ state.activeArticle.body }}</p>
                <div class="icons">
                  <!-- twitter icon -->
                  <a href="https://twitter.com/novelnetdev" target="_blank">
                    <img class="icon" src="../assets/images/twitter-min.png" alt="twitter icon">
                  </a>

                  <!-- email icon -->
                  <a href="mailto:dev@cyrusmcc.com">
                    <img class="icon" src="../assets/images/email-min.png" alt="email icon">
                  </a>
                </div>
              </div>
              <div class="starContentContainer"
                v-show="state.id >= 0 && (state.activePage == 'star' || state.activePage == 'replyToCurrentStar')">
                <div class="bodyHead">
                  <div class="starId">
                    <img id="selectedStarImg" src="" alt="">
                    <h2>Star #{{ state.starNumber }}</h2>
                  </div>
                  <img class="replyIcon" src="../../public/images/replyIcon.svg" alt="reply icon to current message"
                    @click="handleReply">
                </div>
                <p class="stateText">{{ state.text }}</p>
              </div>
              <div class="newMessageArea"
                v-if="state.activePage == 'newMessage' || state.activePage == 'replyToCurrentStar'">
                <textarea v-model="state.newMessage"
                  placeholder="Your energy radiates like a bright star, let's share that with the galaxy!" />
                <div class="buttonAlertContainer">
                  <button class="primaryButton" @click="sendMessage">Send</button>
                </div>
              </div>
            </div>
          </div>
          <div class="contentFooter">
            <div class="starCountContainer" v-if="state.activePage != 'moreInfo'">
              <Transition name="countTransition">
                <span class="totalStarCount" :key="state.totalStars">{{ state.totalStars }}</span>
              </Transition>
              <span> stars</span>
            </div>
            <more-info v-if="state.activePage == 'moreInfo'"></more-info>
            <div class="footerButtons">
              <button class="moreInfoButton" v-if="!state.showReport"
                @click="(state.activePage == 'moreInfo' || state.activePage == 'article') ? state.activePage = 'default' : state.activePage = 'moreInfo'"
                v-html="(state.activePage == 'moreInfo' || state.activePage == 'article') ? 'Back' : 'More Info'"></button>
              <report @reportActive="handleReportToggle" :id="state.id"
                v-show="state.id >= 0 && state.activePage == 'star'" />
            </div>
          </div>
        </div>
        <StarBoard v-if="state.starCount > 0" @selectStar="updateContent" :starCount="state.starCount" />
      </div>
      <div class="bottom">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MessageService from "@/services/MessageService";
import SocketService from "@/services/SocketService";
import StarBoard from "../components/StarBoard.vue";
import Navigation from "@/components/Navigation.vue";
import MoreInfo from "@/components/MoreInfo.vue";
import Report from "@/components/Report.vue";
import Default from "@/components/Default.vue";
import ArticleFeed from "@/components/ArticleFeed.vue";
import { onMounted, watch, reactive, onUnmounted } from "vue";
import { getImageUrl, getColorFilter, getColor, getRandomStarImg } from "@/utils/globalFunctions";

/* Data */
type message = {
  messageContent: string,
  id: number,
  currentReplyTo: number,
  replyText: string,
  replyToColor: string,
  replyToColorFilter: string,
  starNumber: number,
}

let state = reactive({
  id: -1,
  starNumber: -1,
  text: "" as string | undefined,
  replyText: "" as string | undefined,
  currentReplyTo: -1,
  replyStarColor: "" as string | undefined,
  replyStarColorFilter: "" as string | undefined,
  expandReply: false,
  newMessage: "",
  alert: "",
  messages: [] as message[],
  starCount: 0,
  totalStars: 0,
  activePage: "default",
  showReport: false,
  activeArticle: {
    title: "",
    body: "",
  }
});

/* Mounted, Watcher ...*/
onMounted(() => {
  getMessages();
  SocketService.connect();
});

watch(SocketService.getTotalStars, (newVal) => {
  if (state.totalStars == newVal) {
    return;
  }

  state.totalStars = newVal;
});

onUnmounted(() => {
  SocketService.disconnect();
});


/* Methods */
function updateContent(imgUrl: string, tintColorIndex: number) {
  setSelectedStarImg(imgUrl, getColorFilter(tintColorIndex));

  state.alert = ""
  state.text = getMessageText();
  state.activePage = "star";
  state.expandReply = false;
  state.showReport = false;

  if (state.messages.length == 0) {
    getMessages();
  }
}

function setSelectedStarImg(imgUrl: string, tintColorFilter: string) {
  let imgElement = document.getElementById("selectedStarImg") as HTMLImageElement;
  imgElement.setAttribute("src", getImageUrl(imgUrl));
  imgElement.style.display = "block";
  imgElement.style.filter = tintColorFilter;
}

function sendMessage() {

  if (state.newMessage.length <= 8) {
    state.alert = "Message must be at least 8 characters long.";
    return;
  }

  if (state.activePage == "replyToCurrentStar") {
    MessageService.createMessage(state.newMessage, state.id);
  }
  else {
    MessageService.createMessage(state.newMessage, -1);
  }

  state.alert = "Hey, looks like we've got a new star floating around out there!";
  state.totalStars++;
  state.newMessage = "";

  if (state.activePage == "replyToCurrentStar") {
    state.activePage = "star";
  }
  else {
    state.activePage = "default";
  }

}

function getMessages() {
  const getMessages = async () => {
    const data = await MessageService.getMessages();
    return data;
  }

  getMessages().then(data => {
    if (data) {
      state.starCount = data.messages.length;
      state.totalStars = data.totalStars;
      for (let message of data.messages) {
        let colorIndex = Math.floor(Math.random() * 6);
        let m: message = {
          messageContent: message.messageContent,
          id: message.messageId,
          currentReplyTo: message.replyToId,
          replyText: message.replyToContent,
          replyToColor: getColor(colorIndex),
          replyToColorFilter: getColorFilter(colorIndex),
          starNumber: message.starNumber,
        }
        state.messages.push(m);
      }
    }
  });

}

function resetView() {
  state.id = -1;
  state.starNumber = -1;
  state.text = '';
  state.currentReplyTo = -1;
  state.replyText = '';
  state.expandReply = false;
  state.newMessage = '';
  state.alert = '';
  state.activePage = 'default';
  state.showReport = false;
  state.activeArticle = {
    title: "",
    body: "",
  }
}

function getMessageText(): string {
  let index = Math.floor(Math.random() * state.messages.length);
  let message = state.messages[index];
  state.id = message.id;
  state.starNumber = message.starNumber;
  state.currentReplyTo = message.currentReplyTo
  state.replyText = message.replyText;
  state.replyStarColor = message.replyToColor;
  state.replyStarColorFilter = message.replyToColorFilter;
  state.messages.splice(state.messages.indexOf(message), 1);

  while (!message || !message.messageContent) {
    index = Math.floor(Math.random() * state.messages.length);
    message = state.messages[index];
    state.id = message.id;
    state.starNumber = message.starNumber;
    state.currentReplyTo = message.currentReplyTo
    state.replyText = message.replyText;
    state.messages.splice(state.messages.indexOf(message), 1);
  }

  return message.messageContent;
}

function handleReportToggle(showReport: boolean) {
  state.showReport = showReport;
}

function openArticle(title: string, body: string) {
  state.activePage = "article";
  state.activeArticle.title = title;
  state.activeArticle.body = body;
}

function handleReply() {
  if (state.activePage == 'replyToCurrentStar') {
    state.activePage = 'star';
    return;
  }

  state.activePage = 'replyToCurrentStar';
}

function openReply(replyId: number) {
  const getMessage = async () => {
    const data = await MessageService.getMessage(replyId);
    return data;
  }

  getMessage().then(message => {
    if (message) {

      const imgElement = document.getElementById("selectedStarImg") as HTMLImageElement;
      imgElement.style.display = "block";

      const colorIndex = Math.floor(Math.random() * 6);
      const color = getColor(colorIndex);
      const colorFilter = getColorFilter(colorIndex);
      setSelectedStarImg(getRandomStarImg(), state.replyStarColorFilter ? state.replyStarColorFilter : colorFilter);

      state.activePage = 'star';
      state.id = message.messageId;
      state.starNumber = message.starNumber;
      state.text = message.messageContent;
      state.currentReplyTo = message.replyToId;
      state.replyText = message.replyToContent;
      state.replyStarColor = color;
      state.replyStarColorFilter = colorFilter;

    }
  });

}
</script>

<style lang="scss" scoped>
.container {
  @include flexCenter();
  height: 100%;
  width: 100%;
}

.card {
  align-items: center;
  border-radius: 16px;
  border: 3px solid $gray900;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 95%;
  justify-content: center;
  overflow: hidden;
  width: 95%;
}

.nav {
  background: black;
  height: 10%;
  width: 100%;
}

#midContainer {
  align-items: flex-start;
  background: black;
  display: flex;
  flex-direction: column;
  height: 90%;
  overflow: hidden;
  width: 100%;
}

.contentPanel {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
}

.content {
  background: black;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
}

.body {
  align-items: flex-start;
  color: $gray100;
  display: flex;
  flex-direction: column;
  font-family: $techna;
  height: 100%;
  hyphens: auto;
  justify-content: flex-start;
  margin: 0 spacing(1);
  text-align: justify;

  .bodyContent {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    width: 100%;
  }

  .starContentContainer {
    margin-top: 2px;
    max-width: 25rem;
    width: 100%;
  }

  .replyLabel {
    cursor: pointer;
    font-family: $techna;
    font-size: $fontSize2;
    margin-left: 8px;
  }

  .replyToContainer {
    max-width: 25rem;
    width: 100%;
  }

  .replyToText {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    border-radius: 10px;
    box-sizing: border-box;
    color: $gray900;
    cursor: default;
    display: -webkit-box;
    font-family: 'ubuntu', sans-serif;
    hyphens: none;
    margin: spacing(0.5) 0 spacing(1) 0;
    max-height: 5rem;
    overflow: hidden;
    padding: spacing(0.5);
    text-overflow: ellipsis;
    width: 100%;
  }

  .stateText {
    white-space: pre-line;
    margin-bottom: spacing(0.5);
  }

  .icons {
    margin-top: spacing(1);
  }

  .bodyHead {
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 0 spacing(1) 0;
    width: 100%;

    .starId {
      column-gap: spacing(0.5);
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .replyIcon {
      cursor: pointer;
      height: auto;
      width: 24px;
    }

    .replyIcon:hover {
      width: 26px;
    }

    #selectedStarImg {
      animation-delay: 0;
      animation-direction: alternate;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-name: breathe;
      animation-timing-function: ease-in-out;
      display: none;
      height: 32px;
      width: 32px;
    }

    h2 {
      margin: 0;
    }

  }

  .newMessageArea {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    margin-top: 2px;
    width: 100%;

  }

}

.contentFooter {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 0 spacing(1) spacing(1) spacing(1);
  width: 93%;
  row-gap: spacing(0.5);
  color: $gray100;
  font-family: $techna;

  .countTransition {
    animation-name: countTransition;
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
    animation-delay: 0;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  .totalStarCount {
    display: inline-block;
    margin-top: spacing(0.5);
  }

  .footerButtons {
    align-items: flex-end;
    column-gap: spacing(1);
    display: flex;
    flex-direction: row;
    width: 100%;
  }

}

.moreInfoButton {
  background: black;
  border-style: none;
  color: #47A3C6;
  cursor: pointer;
  font-family: $techna;
  font-size: $fontSize1;
  height: fit-content;
  outline: none;
  padding: 0;
  white-space: nowrap;
}

.moreInfoButton:hover {
  color: $gray100;
}

#canvasContainer {
  height: 40%;
  width: 100%;
}

.bottom {
  background: black;
  height: 0%;
  width: 0%;
}

.info {
  margin-top: calc(var(--gap) * 2);
}

@include screen-md() {
  .card {
    height: 75%;
    max-height: 1000px;
    max-width: 1200px;
    width: 80%;
  }

  #midContainer {
    flex-direction: row;
    justify-content: flex-start;
  }

  .contentPanel {
    width: 50%;
  }

  .content {
    height: 100%;
    // width: 50%;
  }

  .body {
    height: 100%;
  }

  #canvasContainer {
    width: 50%;
    height: 100%;
  }

  .bottom {
    background: black;
    height: 0%;
    width: 100%;
  }
}
</style>
