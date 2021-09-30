window.__require = function t(e, i, o) {
function n(c, a) {
if (!i[c]) {
if (!e[c]) {
var s = c.split("/");
s = s[s.length - 1];
if (!e[s]) {
var h = "function" == typeof __require && __require;
if (!a && h) return h(s, !0);
if (r) return r(s, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = s;
}
var l = i[c] = {
exports: {}
};
e[c][0].call(l.exports, function(t) {
return n(e[c][1][t] || t);
}, l, l.exports, t, e, i, o);
}
return i[c].exports;
}
for (var r = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
GameManager: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "63d72N6Lu5CBZq3bcZPjCc1", "GameManager");
var o = this && this.__extends || function() {
var t = function(e, i) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
})(e, i);
};
return function(e, i) {
t(e, i);
function o() {
this.constructor = e;
}
e.prototype = null === i ? Object.create(i) : (o.prototype = i.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, i, o) {
var n, r = arguments.length, c = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, i, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (c = (r < 3 ? n(c) : r > 3 ? n(e, i, c) : n(e, i)) || c);
return r > 3 && c && Object.defineProperty(e, i, c), c;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var r, c = t("./GameUIController"), a = t("./ScoreUIController"), s = t("./Monster"), h = t("./Player"), l = cc._decorator, _ = l.ccclass, u = l.property;
(function(t) {
t[t.LEFT = -1] = "LEFT";
t[t.RIGHT = 1] = "RIGHT";
})(r || (r = {}));
var p = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.feverFinishDelay = .3;
e.gameRestartDelay = 1;
e._menuUI = null;
e._btnDiff = [];
e._gameUI = null;
e._scoreUI = null;
e._monsterDistance = 64;
e._difficulty = 0;
e._score = 0;
e._fever = 0;
e._comboCount = 0;
e._maxCombo = 0;
e._timeCount = 30;
e._health = 3;
e._feverPerScore = 99;
e._insaneTimer = .2;
e._feverMode = !1;
e._blockInput = !0;
e._blockInputFeverFinish = !0;
e.player = null;
e.monsterPrefab = null;
e._monsterDirectionArray = [];
e._monsterArr = [];
e._monsterCount = 4;
return e;
}
e.prototype.onLoad = function() {
this.initMenu();
this._gameUI = cc.find("GameUI").getComponent(c.default);
this._scoreUI = cc.find("ScoreUI").getComponent(a.default);
};
e.prototype.start = function() {
this.showMain();
};
e.prototype.initMenu = function() {
this._menuUI = cc.find("MenuUI");
this._menuUI.active = !0;
cc.find("lbEasy", this._menuUI).on("click", this.startGame.bind(this, 0), this);
cc.find("lbHard", this._menuUI).on("click", this.startGame.bind(this, 1), this);
cc.find("lbHell", this._menuUI).on("click", this.startGame.bind(this, 2), this);
cc.find("lbInsane", this._menuUI).on("click", this.startGame.bind(this, 3), this);
};
e.prototype.showMain = function() {
this.resetGame();
this._gameUI.node.active = !1;
this._menuUI.active = !0;
this._scoreUI.node.active = !1;
};
e.prototype.showResult = function() {
this._gameUI.node.active = !1;
this._menuUI.active = !1;
this._scoreUI.node.active = !0;
this._scoreUI.showResult(this._score, this._maxCombo, 100 * this._health);
};
e.prototype.restartGame = function() {
this.resetGame();
this.startGame(this._difficulty);
};
e.prototype.startGame = function(t) {
var e = this;
this._gameUI.node.active = !0;
this._menuUI.active = !1;
this._scoreUI.node.active = !1;
this._difficulty = t;
this._gameUI.initializeGame();
this._gameUI.updateHealth(this._health);
this._gameUI.updateFever(this._fever);
this._gameUI.updateRemainTime(this._timeCount);
this._gameUI.updateScore(this._score);
this._gameUI.updateCombo(this._comboCount);
for (var i = 0; i < this._monsterCount; i++) this.makeNewMonster();
this._gameUI.startCountDown(1, function() {
e.setInsaneTimer();
e._blockInput = !1;
e._blockInputFeverFinish = !1;
e.schedule(e._updateTimeCount, 1);
});
};
e.prototype.resetGame = function() {
this._score = 0;
this._fever = 0;
this._timeCount = 30;
this._health = 3;
this._feverPerScore = 10;
this._comboCount = 0;
this._maxCombo = 0;
this._monsterDirectionArray.length = 0;
this._monsterArr.forEach(function(t) {
t.node.removeFromParent();
});
this._monsterArr.length = 0;
};
e.prototype._updateTimeCount = function() {
this._timeCount--;
this._gameUI.updateRemainTime(this._timeCount);
0 === this._timeCount && this.gameOver();
};
e.prototype.leftAction = function() {
cc.log("left action");
if (!0 !== this._blockInput && !0 !== this._blockInputFeverFinish) if (this._monsterDirectionArray[0] === r.LEFT || this._feverMode) {
this.player.leftAction();
this.attackMonster();
} else this.playerDamaged();
};
e.prototype.rightAction = function() {
cc.log("right action");
if (!0 !== this._blockInput && !0 !== this._blockInputFeverFinish) if (this._monsterDirectionArray[0] === r.RIGHT || this._feverMode) {
this.player.rightAction();
this.attackMonster();
} else this.playerDamaged();
};
e.prototype.attackMonster = function() {
cc.log("attack monster " + this._feverMode);
if (0 !== this._monsterArr.length) {
if (this._monsterArr[0].damaged(this._feverMode)) {
this._monsterDirectionArray.splice(0, 1);
this._monsterArr.splice(0, 1);
this.moveToCenter();
this.makeNewMonster();
this.score();
this.addFever();
this.setInsaneTimer();
}
this._maxCombo = this._maxCombo > this._comboCount ? this._maxCombo : this._comboCount;
this._gameUI.updateCombo(this._comboCount++);
}
};
e.prototype.moveToCenter = function() {
for (var t = 0; t < this._monsterDirectionArray.length; t++) {
var e = cc.v2((t + 1) * this._monsterDistance * this._monsterDirectionArray[t], 0);
cc.tween(this._monsterArr[t].node).to(.1, {
position: e
}).start();
}
};
e.prototype.makeNewMonster = function() {
var t = Math.floor(2 * Math.random());
0 === t && (t = -1);
this._monsterDirectionArray.push(t);
var e = this._monsterDirectionArray.length, i = cc.instantiate(this.monsterPrefab), o = cc.v2(e * this._monsterDistance * t, 0);
i.setPosition(6 * this._monsterDistance * t, 0);
cc.tween(i).to(.3, {
position: o
}).start();
this.node.addChild(i);
this._monsterArr.push(i.getComponent(s.default));
i.getComponent(s.default).init(t === r.LEFT, this._difficulty);
};
e.prototype.setInsaneTimer = function() {
3 === this._difficulty && this._monsterArr[0].startInsaneTimer();
};
e.prototype.score = function() {
this._score++;
this._gameUI.updateScore(this._score);
};
e.prototype.addFever = function() {
if (!0 !== this._feverMode) {
this._fever += 1 / this._feverPerScore;
this._gameUI.updateFever(this._fever);
this._fever >= 1 && this.feverOn();
}
};
e.prototype.feverOn = function() {
this._feverMode = !0;
this._gameUI.setFeverMode();
this.unschedule(this._updateTimeCount);
this._updateTimeCount();
this.schedule(this._updateFever);
cc.log("fever start ");
};
e.prototype.playerDamaged = function() {
this._health--;
this._health <= 0 && this.gameOver();
this._gameUI.updateHealth(this._health);
this._comboCount = 0;
this._gameUI.updateCombo(this._comboCount);
};
e.prototype.gameOver = function() {
var t = this;
this._blockInputFeverFinish = !0;
this._blockInput = !0;
this._monsterArr[0].pauseTimer();
this._gameUI.gameOver();
this.unschedule(this._updateTimeCount);
this.unschedule(this._updateFever);
setTimeout(function() {
t.showResult();
}, 1500);
};
e.prototype._updateFever = function(t) {
this._fever -= .4 * t;
this._gameUI.updateFever(this._fever);
if (this._fever <= 0) {
this.unschedule(this._updateFever);
this.finishFever();
}
};
e.prototype.finishFever = function() {
var t = this;
cc.log("fever finished", "block inpug");
this._feverMode = !1;
this._blockInputFeverFinish = !0;
this._monsterArr.forEach(function(t) {
t.damaged(!0);
});
this._monsterDirectionArray.length = 0;
this._monsterArr.length = 0;
this._gameUI.finishFeverMode(this.feverFinishDelay, this.gameRestartDelay);
cc.tween(this.node).delay(this.feverFinishDelay).call(function() {
for (var e = 0; e < t._monsterCount; e++) t.makeNewMonster();
}).delay(this.gameRestartDelay).call(function() {
t.schedule(t._updateTimeCount, 1);
t._blockInputFeverFinish = !1;
}).start();
};
e.prototype.runCheat = function() {
0 !== this._monsterDirectionArray.length && (this._monsterDirectionArray[0] === r.LEFT ? this.leftAction() : this.rightAction());
};
n([ u(h.default) ], e.prototype, "player", void 0);
n([ u(cc.Prefab) ], e.prototype, "monsterPrefab", void 0);
return e = n([ _ ], e);
}(cc.Component);
i.default = p;
cc._RF.pop();
}, {
"./GameUIController": "GameUIController",
"./Monster": "Monster",
"./Player": "Player",
"./ScoreUIController": "ScoreUIController"
} ],
GameUIController: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "9a3c2iy99NH56d1j9pre9+h", "GameUIController");
var o = this && this.__extends || function() {
var t = function(e, i) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
})(e, i);
};
return function(e, i) {
t(e, i);
function o() {
this.constructor = e;
}
e.prototype = null === i ? Object.create(i) : (o.prototype = i.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, i, o) {
var n, r = arguments.length, c = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, i, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (c = (r < 3 ? n(c) : r > 3 ? n(e, i, c) : n(e, i)) || c);
return r > 3 && c && Object.defineProperty(e, i, c), c;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = t("./GameManager"), c = cc._decorator, a = c.ccclass, s = c.property, h = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._gameManager = null;
e._gameUI = null;
e._lbScore = null;
e._lbTime = null;
e._lbGameOver = null;
e._btnMain = null;
e._lbReady = null;
e._lbGo = null;
e._lbFever = null;
e._lbFeverFinish = null;
e._feverGauge = null;
e._heartContainer = null;
e._lbCombo = null;
e.heartPrefab = null;
return e;
}
e.prototype.onLoad = function() {
this._gameManager = cc.find("GameManager").getComponent(r.default);
this._gameUI = this.node;
this._lbScore = cc.find("lbScore", this._gameUI).getComponent(cc.Label);
this._lbTime = cc.find("lbTime", this._gameUI).getComponent(cc.Label);
this._lbGameOver = cc.find("lbGameOver", this._gameUI);
this._lbReady = cc.find("lbReady", this._gameUI);
this._lbGo = cc.find("lbGo", this._gameUI);
this._lbFever = cc.find("lbFever", this._gameUI);
this._feverGauge = cc.find("feverGauge", this._gameUI).getComponent(cc.ProgressBar);
this._heartContainer = cc.find("heartContainer", this._gameUI);
this._btnMain = cc.find("lbGameOver/btnMain", this._gameUI);
this._lbFeverFinish = cc.find("lbFeverFinish", this._gameUI);
this._lbCombo = cc.find("comboUI/lbCombo", this._gameUI).getComponent(cc.Label);
this._lbScore.node.active = !0;
this._lbTime.node.active = !0;
this._lbGameOver.active = !1;
this._lbFever.active = !1;
this._lbGo.active = !1;
this._lbReady.active = !1;
this._feverGauge.node.active = !0;
};
e.prototype.initializeGame = function() {
this._lbScore.node.active = !0;
this._lbTime.node.active = !0;
this._lbGameOver.active = !1;
this._lbFever.active = !1;
this._lbFeverFinish.active = !1;
this._lbGo.active = !1;
this._lbReady.active = !1;
this._feverGauge.node.active = !0;
this._heartContainer.active = !0;
var t = cc.instantiate(this.heartPrefab);
this._heartContainer.addChild(t);
t = cc.instantiate(this.heartPrefab);
this._heartContainer.addChild(t);
t = cc.instantiate(this.heartPrefab);
this._heartContainer.addChild(t);
};
e.prototype.startCountDown = function(t, e) {
var i = this;
cc.tween(this.node).call(function() {
i._lbReady.active = !0;
}).delay(t).call(function() {
i._lbReady.active = !1;
i._lbGo.active = !0;
e();
}).delay(.4).call(function() {
i._lbGo.active = !1;
}).start();
};
e.prototype.updateHealth = function(t) {
t < 0 && cc.warn("health below 0 ", t);
for (var e = 0; e < this._heartContainer.children.length; e++) this._heartContainer.children[e].active = e < t;
};
e.prototype.updateRemainTime = function(t) {
this._lbTime.string = t + "";
};
e.prototype.updateScore = function(t) {
this._lbScore.string = t + "";
};
e.prototype.updateFever = function(t) {
this._feverGauge.progress = t;
};
e.prototype.setFeverMode = function() {
this._lbFever.active = !0;
this._lbFever.opacity = 255;
};
e.prototype.finishFeverMode = function(t, e) {
var i = this;
this._lbFeverFinish.active = !0;
cc.tween(this._lbFever).to(t, {
opacity: 0
}).delay(e).call(function() {
i._lbFeverFinish.active = !1;
}).start();
};
e.prototype.gameOver = function() {
this._lbGameOver.active = !0;
};
e.prototype.updateCombo = function(t) {
this._lbCombo.node.parent.active = 0 !== t;
this._lbCombo.string = t + "\nCombo";
};
n([ s(cc.Prefab) ], e.prototype, "heartPrefab", void 0);
return e = n([ a ], e);
}(cc.Component);
i.default = h;
cc._RF.pop();
}, {
"./GameManager": "GameManager"
} ],
InputManager: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "ed9110pmEVNjpdiSE4F2dRP", "InputManager");
var o = this && this.__extends || function() {
var t = function(e, i) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
})(e, i);
};
return function(e, i) {
t(e, i);
function o() {
this.constructor = e;
}
e.prototype = null === i ? Object.create(i) : (o.prototype = i.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, i, o) {
var n, r = arguments.length, c = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, i, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (c = (r < 3 ? n(c) : r > 3 ? n(e, i, c) : n(e, i)) || c);
return r > 3 && c && Object.defineProperty(e, i, c), c;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = cc._decorator, c = r.ccclass, a = (r.property, function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._pressA = !1;
e._pressB = !1;
e.gameMamager = null;
e._leftPanel = null;
e._rightPanel = null;
e._inputDelay = .1;
e._blockInput = !1;
return e;
}
e.prototype.onLoad = function() {
this.gameMamager = this.getComponent("GameManager");
this._leftPanel = cc.find("InputPanelLeft");
this._rightPanel = cc.find("InputPanelRight");
};
e.prototype.start = function() {
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
cc.log("init event ");
this._leftPanel.on("click", this.gameMamager.leftAction, this.gameMamager);
this._rightPanel.on("click", this.gameMamager.rightAction, this.gameMamager);
};
e.prototype.onDestroy = function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
};
e.prototype.onKeyDown = function(t) {
switch (t.keyCode) {
case cc.macro.KEY.left:
!1 === this._pressA && this.gameMamager.leftAction();
this._pressA = !0;
this.blockInput();
break;

case cc.macro.KEY.right:
!1 === this._pressB && this.gameMamager.rightAction();
this._pressB = !0;
this.blockInput();
}
};
e.prototype.onKeyUp = function(t) {
switch (t.keyCode) {
case cc.macro.KEY.left:
this._pressA = !1;
break;

case cc.macro.KEY.right:
this._pressB = !1;
}
};
e.prototype.blockInput = function() {
var t = this;
this._blockInput = !0;
cc.tween(this.node).delay(this._inputDelay).call(function() {
t._blockInput = !1;
}).start();
};
return e = n([ c ], e);
}(cc.Component));
i.default = a;
cc._RF.pop();
}, {} ],
MenuUIController: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "67b1ahLu/RIK61zKAZCKmir", "MenuUIController");
var o = this && this.__extends || function() {
var t = function(e, i) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
})(e, i);
};
return function(e, i) {
t(e, i);
function o() {
this.constructor = e;
}
e.prototype = null === i ? Object.create(i) : (o.prototype = i.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, i, o) {
var n, r = arguments.length, c = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, i, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (c = (r < 3 ? n(c) : r > 3 ? n(e, i, c) : n(e, i)) || c);
return r > 3 && c && Object.defineProperty(e, i, c), c;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = cc._decorator, c = r.ccclass, a = (r.property, function(t) {
o(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return e = n([ c ], e);
}(cc.Component));
i.default = a;
cc._RF.pop();
}, {} ],
Monster: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "c466cyFnN5JiYq4HvWvxS7j", "Monster");
var o = this && this.__extends || function() {
var t = function(e, i) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
})(e, i);
};
return function(e, i) {
t(e, i);
function o() {
this.constructor = e;
}
e.prototype = null === i ? Object.create(i) : (o.prototype = i.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, i, o) {
var n, r = arguments.length, c = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, i, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (c = (r < 3 ? n(c) : r > 3 ? n(e, i, c) : n(e, i)) || c);
return r > 3 && c && Object.defineProperty(e, i, c), c;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = t("./GameManager"), c = cc._decorator, a = c.ccclass, s = (c.property, function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.colorArr = [ cc.color(255, 251, 171), cc.color(171, 251, 255), cc.color(255, 171, 255) ];
e.health = 1;
e.hp = [];
e._atkTimer = null;
e.gameManager = null;
e._characterNode = null;
e._animation = null;
e._atkTimerCur = 99;
e._atkTimerBase = .5;
return e;
}
e.prototype.onLoad = function() {
this._atkTimer = cc.find("atkTimer", this.node).getComponent(cc.ProgressBar);
this._atkTimer.node.active = !1;
this._characterNode = cc.find("CharacterNode", this.node);
this.gameManager = cc.find("GameManager").getComponent(r.default);
};
e.prototype.init = function(t, e) {
this._animation = this._characterNode.getComponent(cc.Animation);
var i = 0 === e ? 2 : 3, o = Math.floor(Math.random() * i) + 1;
t && (this.node.scaleX = -1);
var n = cc.find("HealthContainer", this.node);
this.hp.push(n.children[0]);
this.hp.push(n.children[1]);
this.hp.push(n.children[2]);
if (1 === o) {
this._characterNode.color = this.colorArr[0];
this.hp[0].color = this.colorArr[0];
this.hp[1].color = this.colorArr[0];
this.hp[2].color = this.colorArr[0];
this.hp[0].active = !0;
this.hp[1].active = !1;
this.hp[2].active = !1;
} else if (2 === o) {
this._characterNode.color = this.colorArr[1];
this.hp[0].color = this.colorArr[1];
this.hp[1].color = this.colorArr[1];
this.hp[2].color = this.colorArr[1];
this.hp[0].active = !0;
this.hp[1].active = !0;
this.hp[2].active = !1;
} else if (3 === o) {
this._characterNode.color = this.colorArr[2];
this.hp[0].color = this.colorArr[2];
this.hp[1].color = this.colorArr[2];
this.hp[2].color = this.colorArr[2];
this.hp[0].active = !0;
this.hp[1].active = !0;
this.hp[2].active = !0;
}
if (e >= 2) {
this.hp[0].active = !1;
this.hp[1].active = !1;
this.hp[2].active = !1;
}
e >= 3 && (this._atkTimer.node.active = !0);
this.health = o;
this._animation.play("monsterIdle");
};
e.prototype.damaged = function(t) {
this.health--;
this.hp[this.health].active = !1;
this._atkTimerCur = this._atkTimerBase;
this._animation.play("monsterDamage");
if (0 === this.health || t) {
this.dieAnimation();
return !0;
}
return !1;
};
e.prototype.dieAnimation = function() {
this._animation.play("monsterDead");
cc.tween(this.node).to(.1, {
opacity: 0,
position: cc.v2(this.node.x, 100)
}).removeSelf().start();
};
e.prototype.startInsaneTimer = function() {
this._atkTimer.node.active = !0;
this._atkTimerCur = this._atkTimerBase;
this.schedule(this._insaneModeTimer, 0);
};
e.prototype._insaneModeTimer = function(t) {
this._atkTimerCur -= t;
this._atkTimer.progress = this._atkTimerCur / this._atkTimerBase;
if (this._atkTimerCur <= 0) {
this._atkTimerCur = this._atkTimerBase;
this._attack();
}
};
e.prototype._attack = function() {
this.gameManager.playerDamaged();
};
e.prototype.pauseTimer = function() {
this.unschedule(this._insaneModeTimer);
};
return e = n([ a ], e);
}(cc.Component));
i.default = s;
cc._RF.pop();
}, {
"./GameManager": "GameManager"
} ],
Player: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "c66e4G3AcpI24NSYsCKjmH8", "Player");
var o = this && this.__extends || function() {
var t = function(e, i) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
})(e, i);
};
return function(e, i) {
t(e, i);
function o() {
this.constructor = e;
}
e.prototype = null === i ? Object.create(i) : (o.prototype = i.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, i, o) {
var n, r = arguments.length, c = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, i, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (c = (r < 3 ? n(c) : r > 3 ? n(e, i, c) : n(e, i)) || c);
return r > 3 && c && Object.defineProperty(e, i, c), c;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = cc._decorator, c = r.ccclass, a = (r.property, function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._animation = null;
e._animationName = [ "characterIdle", "characterAtk1", "characterAtk2", "characterAtk3" ];
e._baseScale = .5;
e._currentAtkAnim = 0;
e._atkAnimationInterval = .2;
e._actionTimeout = -1;
return e;
}
e.prototype.onLoad = function() {
this._animation = this.getComponent(cc.Animation);
this._animation.on("finished", this.onAnimFinishedCallback, this);
};
e.prototype.init = function() {};
e.prototype.leftAction = function() {
this.node.scaleX = -1 * this._baseScale;
this._playAtkAnim();
};
e.prototype.rightAction = function() {
this.node.scaleX = this._baseScale;
this._playAtkAnim();
};
e.prototype._playAtkAnim = function() {
this._currentAtkAnim++;
this._currentAtkAnim > 3 && (this._currentAtkAnim = 1);
clearTimeout(this._actionTimeout);
this._actionTimeout = -1;
this._animation.play("characterAtk" + this._currentAtkAnim);
};
e.prototype.onAnimFinishedCallback = function() {
var t = this;
this._actionTimeout = setTimeout(function() {
t._animation.play("characterIdle");
t._currentAtkAnim = 0;
t._actionTimeout = -1;
}, 1e3 * this._atkAnimationInterval);
};
return e = n([ c ], e);
}(cc.Component));
i.default = a;
cc._RF.pop();
}, {} ],
ScoreUIController: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "ed0da5VlfBPErq9rB13bhFB", "ScoreUIController");
var o = this && this.__extends || function() {
var t = function(e, i) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
})(e, i);
};
return function(e, i) {
t(e, i);
function o() {
this.constructor = e;
}
e.prototype = null === i ? Object.create(i) : (o.prototype = i.prototype, new o());
};
}(), n = this && this.__decorate || function(t, e, i, o) {
var n, r = arguments.length, c = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, i, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (c = (r < 3 ? n(c) : r > 3 ? n(e, i, c) : n(e, i)) || c);
return r > 3 && c && Object.defineProperty(e, i, c), c;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = t("./GameManager"), c = cc._decorator, a = c.ccclass, s = (c.property, function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._gameManager = null;
e._lbScore = null;
e._lbCombo = null;
e._lbLife = null;
e._lbTotal = null;
e._btnMain = null;
e._btnRetry = null;
e._targetLabel = null;
e._counter = 20;
e._countingTime = 1;
e._score = 0;
e._combo = 0;
e._life = 0;
return e;
}
e.prototype.onLoad = function() {
this._gameManager = cc.find("GameManager").getComponent(r.default);
this._lbScore = cc.find("lbScore2", this.node).getComponent(cc.Label);
this._lbCombo = cc.find("lbCombo2", this.node).getComponent(cc.Label);
this._lbLife = cc.find("lbLife2", this.node).getComponent(cc.Label);
this._lbTotal = cc.find("lbTotal2", this.node).getComponent(cc.Label);
this._btnMain = cc.find("btnMain", this.node);
this._btnRetry = cc.find("btnRetry", this.node);
this._btnMain.active = !1;
this._btnRetry.active = !1;
this._btnMain.on("click", this._gameManager.showMain, this._gameManager);
this._btnRetry.on("click", this._gameManager.restartGame, this._gameManager);
this.node.on("click", this._skipCounting, this);
};
e.prototype.showResult = function(t, e, i) {
var o = this;
this._score = t;
this._combo = e;
this._life = i;
this._lbScore.string = "";
this._lbCombo.string = "";
this._lbLife.string = "";
this._lbTotal.string = "";
cc.tween(this.node).call(function() {
o._labelCounting(o._lbScore, 0, t);
o._labelCounting(o._lbTotal, 0, t);
}).delay(this._countingTime + .5).call(function() {
o._labelCounting(o._lbCombo, 0, e);
o._labelCounting(o._lbTotal, t, t + e);
}).delay(this._countingTime + .5).call(function() {
o._labelCounting(o._lbLife, 0, i);
o._labelCounting(o._lbTotal, t + e, t + e + i);
}).delay(this._countingTime + .5).call(function() {
o._showRetry();
}).start();
};
e.prototype._labelCounting = function(t, e, i) {
var o = this._countingTime / this._counter, n = e, r = (i - e) / this._counter;
t.schedule(function() {
n += r;
t.string = Math.round(n).toString();
}, o, this._counter - 1);
};
e.prototype._skipCounting = function() {
cc.director.getActionManager().removeAllActionsFromTarget(this.node, !0);
this._lbScore.unscheduleAllCallbacks();
this._lbLife.unscheduleAllCallbacks();
this._lbCombo.unscheduleAllCallbacks();
this._lbTotal.unscheduleAllCallbacks();
this._lbScore.string = this._score.toString();
this._lbCombo.string = this._combo.toString();
this._lbLife.string = this._life.toString();
this._lbTotal.string = (this._score + this._combo + this._life).toString();
this._showRetry();
};
e.prototype._showRetry = function() {
this._btnMain.active = !0;
this._btnRetry.active = !0;
};
return e = n([ a ], e);
}(cc.Component));
i.default = s;
cc._RF.pop();
}, {
"./GameManager": "GameManager"
} ]
}, {}, [ "GameManager", "GameUIController", "InputManager", "MenuUIController", "Monster", "Player", "ScoreUIController" ]);
//# sourceMappingURL=index.js.map
