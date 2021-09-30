window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  GameManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "63d72N6Lu5CBZq3bcZPjCc1", "GameManager");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameUIController_1 = require("./GameUIController");
    var ScoreUIController_1 = require("./ScoreUIController");
    var Monster_1 = require("./Monster");
    var Player_1 = require("./Player");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DIRECTION;
    (function(DIRECTION) {
      DIRECTION[DIRECTION["LEFT"] = -1] = "LEFT";
      DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION || (DIRECTION = {}));
    var GameManager = function(_super) {
      __extends(GameManager, _super);
      function GameManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.feverFinishDelay = .3;
        _this.gameRestartDelay = 1;
        _this._menuUI = null;
        _this._btnDiff = [];
        _this._gameUI = null;
        _this._scoreUI = null;
        _this._difficulty = 0;
        _this._score = 0;
        _this._fever = 0;
        _this._comboCount = 0;
        _this._maxCombo = 0;
        _this._timeCount = 30;
        _this._health = 3;
        _this._feverPerScore = 99;
        _this._insaneTimer = .2;
        _this._feverMode = false;
        _this._blockInputMovement = true;
        _this._blockInputFeverFinish = true;
        _this.player = null;
        _this.monsterPrefab = null;
        _this._monsterDirectionArray = [];
        _this._monsterArr = [];
        _this._monsterCount = 4;
        return _this;
      }
      GameManager.prototype.onLoad = function() {
        this.initMenu();
        this._gameUI = cc.find("GameUI").getComponent(GameUIController_1.default);
        this._scoreUI = cc.find("ScoreUI").getComponent(ScoreUIController_1.default);
      };
      GameManager.prototype.start = function() {
        this.showMain();
      };
      GameManager.prototype.initMenu = function() {
        this._menuUI = cc.find("MenuUI");
        this._menuUI.active = true;
        cc.find("lbEasy", this._menuUI).on("click", this.startGame.bind(this, 0), this);
        cc.find("lbHard", this._menuUI).on("click", this.startGame.bind(this, 1), this);
        cc.find("lbHell", this._menuUI).on("click", this.startGame.bind(this, 2), this);
        cc.find("lbInsane", this._menuUI).on("click", this.startGame.bind(this, 3), this);
      };
      GameManager.prototype.showMain = function() {
        this.resetGame();
        this._gameUI.node.active = false;
        this._menuUI.active = true;
        this._scoreUI.node.active = false;
      };
      GameManager.prototype.showResult = function() {
        this._gameUI.node.active = false;
        this._menuUI.active = false;
        this._scoreUI.node.active = true;
        this._scoreUI.showResult(this._score, this._maxCombo, 100 * this._health);
      };
      GameManager.prototype.restartGame = function() {
        this.resetGame();
        this.startGame(this._difficulty);
      };
      GameManager.prototype.startGame = function(diff) {
        var _this = this;
        this._gameUI.node.active = true;
        this._menuUI.active = false;
        this._scoreUI.node.active = false;
        this._difficulty = diff;
        this._gameUI.initializeGame();
        this._gameUI.updateHealth(this._health);
        this._gameUI.updateFever(this._fever);
        this._gameUI.updateRemainTime(this._timeCount);
        this._gameUI.updateScore(this._score);
        this._gameUI.updateCombo(this._comboCount);
        for (var i = 0; i < this._monsterCount; i++) this.makeNewMonster();
        var countDown = 1;
        this._gameUI.startCountDown(countDown, function() {
          _this.setInsaneTimer();
          _this._blockInputMovement = false;
          _this._blockInputFeverFinish = false;
          _this.schedule(_this._updateTimeCount, 1);
        });
      };
      GameManager.prototype.resetGame = function() {
        this._score = 0;
        this._fever = 0;
        this._timeCount = 30;
        this._health = 3;
        this._feverPerScore = 10;
        this._comboCount = 0;
        this._maxCombo = 0;
        this._monsterDirectionArray.length = 0;
        this._monsterArr.forEach(function(element) {
          element.node.removeFromParent();
        });
        this._monsterArr.length = 0;
      };
      GameManager.prototype._updateTimeCount = function() {
        this._timeCount--;
        this._gameUI.updateRemainTime(this._timeCount);
        0 === this._timeCount && this.gameOver();
      };
      GameManager.prototype.leftAction = function() {
        cc.log("left action");
        if (true === this._blockInputMovement || true === this._blockInputFeverFinish) return;
        if (this._monsterDirectionArray[0] === DIRECTION.LEFT || this._feverMode) {
          this.player.leftAction();
          this.attackMonster();
        } else this.playerDamaged();
      };
      GameManager.prototype.rightAction = function() {
        cc.log("right action");
        if (true === this._blockInputMovement || true === this._blockInputFeverFinish) return;
        if (this._monsterDirectionArray[0] === DIRECTION.RIGHT || this._feverMode) {
          this.player.rightAction();
          this.attackMonster();
        } else this.playerDamaged();
      };
      GameManager.prototype.attackMonster = function() {
        cc.log("attack monster " + this._feverMode);
        if (0 === this._monsterArr.length) return;
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
      };
      GameManager.prototype.moveToCenter = function() {
        var _this = this;
        this._blockInputMovement = true;
        for (var i = 0; i < this._monsterDirectionArray.length; i++) {
          var targetPos = cc.v2(100 * (i + 1) * this._monsterDirectionArray[i], 0);
          cc.tween(this._monsterArr[i].node).to(.1, {
            position: targetPos
          }).start();
        }
        cc.tween(this.node).delay(.1).call(function() {
          _this._blockInputMovement = false;
        }).start();
      };
      GameManager.prototype.makeNewMonster = function() {
        var pos = Math.floor(2 * Math.random());
        0 === pos && (pos = -1);
        this._monsterDirectionArray.push(pos);
        var index = this._monsterDirectionArray.length;
        var monster = cc.instantiate(this.monsterPrefab);
        var moveTargetPos = cc.v2(100 * index * pos, 0);
        monster.setPosition(500 * pos, 0);
        cc.tween(monster).to(.3, {
          position: moveTargetPos
        }).start();
        this.node.addChild(monster);
        this._monsterArr.push(monster.getComponent(Monster_1.default));
        monster.getComponent(Monster_1.default).init(pos === DIRECTION.LEFT, this._difficulty);
      };
      GameManager.prototype.setInsaneTimer = function() {
        3 === this._difficulty && this._monsterArr[0].startInsaneTimer();
      };
      GameManager.prototype.score = function() {
        this._score++;
        this._gameUI.updateScore(this._score);
      };
      GameManager.prototype.addFever = function() {
        if (true === this._feverMode) return;
        this._fever += 1 / this._feverPerScore;
        this._gameUI.updateFever(this._fever);
        this._fever >= 1 && this.feverOn();
      };
      GameManager.prototype.feverOn = function() {
        this._feverMode = true;
        this._gameUI.setFeverMode();
        this.unschedule(this._updateTimeCount);
        this._updateTimeCount();
        this.schedule(this._updateFever);
        cc.log("fever start ");
      };
      GameManager.prototype.playerDamaged = function() {
        this._health--;
        this._health <= 0 && this.gameOver();
        this._gameUI.updateHealth(this._health);
        this._comboCount = 0;
        this._gameUI.updateCombo(this._comboCount);
      };
      GameManager.prototype.gameOver = function() {
        var _this = this;
        this._blockInputFeverFinish = true;
        this._blockInputMovement = true;
        this._monsterArr[0].pauseTimer();
        this._gameUI.gameOver();
        this.unschedule(this._updateTimeCount);
        this.unschedule(this._updateFever);
        setTimeout(function() {
          _this.showResult();
        }, 1500);
      };
      GameManager.prototype._updateFever = function(dt) {
        this._fever -= .4 * dt;
        this._gameUI.updateFever(this._fever);
        if (this._fever <= 0) {
          this.unschedule(this._updateFever);
          this.finishFever();
        }
      };
      GameManager.prototype.finishFever = function() {
        var _this = this;
        cc.log("fever finished", "block inpug");
        this._feverMode = false;
        this._blockInputFeverFinish = true;
        this._monsterArr.forEach(function(element) {
          element.damaged(true);
        });
        this._monsterDirectionArray.length = 0;
        this._monsterArr.length = 0;
        this._gameUI.finishFeverMode(this.feverFinishDelay, this.gameRestartDelay);
        cc.tween(this.node).delay(this.feverFinishDelay).call(function() {
          for (var i = 0; i < _this._monsterCount; i++) _this.makeNewMonster();
        }).delay(this.gameRestartDelay).call(function() {
          _this.schedule(_this._updateTimeCount, 1);
          _this._blockInputFeverFinish = false;
        }).start();
      };
      GameManager.prototype.runCheat = function() {
        if (0 === this._monsterDirectionArray.length) return;
        this._monsterDirectionArray[0] === DIRECTION.LEFT ? this.leftAction() : this.rightAction();
      };
      __decorate([ property(Player_1.default) ], GameManager.prototype, "player", void 0);
      __decorate([ property(cc.Prefab) ], GameManager.prototype, "monsterPrefab", void 0);
      GameManager = __decorate([ ccclass ], GameManager);
      return GameManager;
    }(cc.Component);
    exports.default = GameManager;
    cc._RF.pop();
  }, {
    "./GameUIController": "GameUIController",
    "./Monster": "Monster",
    "./Player": "Player",
    "./ScoreUIController": "ScoreUIController"
  } ],
  GameUIController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a3c2iy99NH56d1j9pre9+h", "GameUIController");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("./GameManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameUIController = function(_super) {
      __extends(GameUIController, _super);
      function GameUIController() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._gameManager = null;
        _this._gameUI = null;
        _this._lbScore = null;
        _this._lbTime = null;
        _this._lbGameOver = null;
        _this._btnMain = null;
        _this._lbReady = null;
        _this._lbGo = null;
        _this._lbFever = null;
        _this._lbFeverFinish = null;
        _this._feverGauge = null;
        _this._heartContainer = null;
        _this._lbCombo = null;
        _this.heartPrefab = null;
        return _this;
      }
      GameUIController.prototype.onLoad = function() {
        this._gameManager = cc.find("GameManager").getComponent(GameManager_1.default);
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
        this._lbScore.node.active = true;
        this._lbTime.node.active = true;
        this._lbGameOver.active = false;
        this._lbFever.active = false;
        this._lbGo.active = false;
        this._lbReady.active = false;
        this._feverGauge.node.active = true;
      };
      GameUIController.prototype.initializeGame = function() {
        this._lbScore.node.active = true;
        this._lbTime.node.active = true;
        this._lbGameOver.active = false;
        this._lbFever.active = false;
        this._lbFeverFinish.active = false;
        this._lbGo.active = false;
        this._lbReady.active = false;
        this._feverGauge.node.active = true;
        this._heartContainer.active = true;
        var heart = cc.instantiate(this.heartPrefab);
        this._heartContainer.addChild(heart);
        heart = cc.instantiate(this.heartPrefab);
        this._heartContainer.addChild(heart);
        heart = cc.instantiate(this.heartPrefab);
        this._heartContainer.addChild(heart);
      };
      GameUIController.prototype.startCountDown = function(countDown, gameStartCallback) {
        var _this = this;
        cc.tween(this.node).call(function() {
          _this._lbReady.active = true;
        }).delay(countDown).call(function() {
          _this._lbReady.active = false;
          _this._lbGo.active = true;
          gameStartCallback();
        }).delay(.4).call(function() {
          _this._lbGo.active = false;
        }).start();
      };
      GameUIController.prototype.updateHealth = function(health) {
        health < 0 && cc.warn("health below 0 ", health);
        for (var i = 0; i < this._heartContainer.children.length; i++) this._heartContainer.children[i].active = i < health;
      };
      GameUIController.prototype.updateRemainTime = function(time) {
        this._lbTime.string = time + "";
      };
      GameUIController.prototype.updateScore = function(score) {
        this._lbScore.string = score + "";
      };
      GameUIController.prototype.updateFever = function(fever) {
        this._feverGauge.progress = fever;
      };
      GameUIController.prototype.setFeverMode = function() {
        this._lbFever.active = true;
        this._lbFever.opacity = 255;
      };
      GameUIController.prototype.finishFeverMode = function(feverFinishDelay, gameRestartDelay) {
        var _this = this;
        this._lbFeverFinish.active = true;
        cc.tween(this._lbFever).to(feverFinishDelay, {
          opacity: 0
        }).delay(gameRestartDelay).call(function() {
          _this._lbFeverFinish.active = false;
        }).start();
      };
      GameUIController.prototype.gameOver = function() {
        this._lbGameOver.active = true;
      };
      GameUIController.prototype.updateCombo = function(count) {
        this._lbCombo.node.parent.active = 0 !== count;
        this._lbCombo.string = count + "\nCombo";
      };
      __decorate([ property(cc.Prefab) ], GameUIController.prototype, "heartPrefab", void 0);
      GameUIController = __decorate([ ccclass ], GameUIController);
      return GameUIController;
    }(cc.Component);
    exports.default = GameUIController;
    cc._RF.pop();
  }, {
    "./GameManager": "GameManager"
  } ],
  InputManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ed9110pmEVNjpdiSE4F2dRP", "InputManager");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var InputManager = function(_super) {
      __extends(InputManager, _super);
      function InputManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._pressA = false;
        _this._pressB = false;
        _this.gameMamager = null;
        _this._leftPanel = null;
        _this._rightPanel = null;
        return _this;
      }
      InputManager.prototype.onLoad = function() {
        this.gameMamager = this.getComponent("GameManager");
        this._leftPanel = cc.find("InputPanelLeft");
        this._rightPanel = cc.find("InputPanelRight");
      };
      InputManager.prototype.start = function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.log("init event ");
        this._leftPanel.on("click", this.gameMamager.leftAction, this.gameMamager);
        this._rightPanel.on("click", this.gameMamager.rightAction, this.gameMamager);
      };
      InputManager.prototype.onDestroy = function() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
      };
      InputManager.prototype.onKeyDown = function(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.left:
          false === this._pressA && this.gameMamager.leftAction();
          this._pressA = true;
          break;

         case cc.macro.KEY.right:
          false === this._pressB && this.gameMamager.rightAction();
          this._pressB = true;
        }
      };
      InputManager.prototype.onKeyUp = function(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.left:
          this._pressA = false;
          break;

         case cc.macro.KEY.right:
          this._pressB = false;
        }
      };
      InputManager = __decorate([ ccclass ], InputManager);
      return InputManager;
    }(cc.Component);
    exports.default = InputManager;
    cc._RF.pop();
  }, {} ],
  MenuUIController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "67b1ahLu/RIK61zKAZCKmir", "MenuUIController");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MainUIController = function(_super) {
      __extends(MainUIController, _super);
      function MainUIController() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      MainUIController = __decorate([ ccclass ], MainUIController);
      return MainUIController;
    }(cc.Component);
    exports.default = MainUIController;
    cc._RF.pop();
  }, {} ],
  Monster: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c466cyFnN5JiYq4HvWvxS7j", "Monster");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("./GameManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Monster = function(_super) {
      __extends(Monster, _super);
      function Monster() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.colorArr = [ cc.color(255, 251, 171), cc.color(171, 251, 255), cc.color(255, 171, 255) ];
        _this.health = 1;
        _this.lbHealth = null;
        _this.hp = [];
        _this._atkTimer = null;
        _this.gameManager = null;
        _this._animation = null;
        _this._atkTimerCur = 99;
        _this._atkTimerBase = .5;
        return _this;
      }
      Monster.prototype.onLoad = function() {
        this._atkTimer = cc.find("atkTimer", this.node).getComponent(cc.ProgressBar);
        this._atkTimer.node.active = false;
        this.gameManager = cc.find("GameManager").getComponent(GameManager_1.default);
      };
      Monster.prototype.init = function(isLeft, difficulty) {
        this._animation = this.getComponent(cc.Animation);
        var rnd = 0 === difficulty ? 2 : 3;
        var health = Math.floor(Math.random() * rnd) + 1;
        isLeft && (this.node.scaleX = -1);
        this.hp.push(this.node.children[1]);
        this.hp.push(this.node.children[2]);
        this.hp.push(this.node.children[3]);
        if (1 === health) {
          this.node.color = this.colorArr[0];
          this.hp[0].color = this.colorArr[0];
          this.hp[1].color = this.colorArr[0];
          this.hp[2].color = this.colorArr[0];
          this.hp[0].active = true;
          this.hp[1].active = false;
          this.hp[2].active = false;
        } else if (2 === health) {
          this.node.color = this.colorArr[1];
          this.hp[0].color = this.colorArr[1];
          this.hp[1].color = this.colorArr[1];
          this.hp[2].color = this.colorArr[1];
          this.hp[0].active = true;
          this.hp[1].active = true;
          this.hp[2].active = false;
        } else if (3 === health) {
          this.node.color = this.colorArr[2];
          this.hp[0].color = this.colorArr[2];
          this.hp[1].color = this.colorArr[2];
          this.hp[2].color = this.colorArr[2];
          this.hp[0].active = true;
          this.hp[1].active = true;
          this.hp[2].active = true;
        }
        if (difficulty >= 2) {
          this.hp[0].active = false;
          this.hp[1].active = false;
          this.hp[2].active = false;
        }
        difficulty >= 3 && (this._atkTimer.node.active = true);
        this.health = health;
        this.lbHealth = cc.find("lbHealth", this.node).getComponent(cc.Label);
        this.lbHealth.string = this.health + "";
        this._animation.play("monsterIdle");
      };
      Monster.prototype.damaged = function(onePunch) {
        this.health--;
        this.lbHealth.string = this.health + "";
        this.hp[this.health].active = false;
        this._atkTimerCur = this._atkTimerBase;
        this._animation.play("monsterDamage");
        if (0 === this.health || onePunch) {
          this.dieAnimation();
          return true;
        }
        return false;
      };
      Monster.prototype.dieAnimation = function() {
        this._animation.play("monsterDead");
        cc.tween(this.node).to(.1, {
          opacity: 0,
          position: cc.v2(this.node.x, 100)
        }).removeSelf().start();
      };
      Monster.prototype.startInsaneTimer = function() {
        this._atkTimer.node.active = true;
        this._atkTimerCur = this._atkTimerBase;
        this.schedule(this._insaneModeTimer, 0);
      };
      Monster.prototype._insaneModeTimer = function(dt) {
        this._atkTimerCur -= dt;
        this._atkTimer.progress = this._atkTimerCur / this._atkTimerBase;
        if (this._atkTimerCur <= 0) {
          this._atkTimerCur = this._atkTimerBase;
          this._attack();
        }
      };
      Monster.prototype._attack = function() {
        this.gameManager.playerDamaged();
      };
      Monster.prototype.pauseTimer = function() {
        this.unschedule(this._insaneModeTimer);
      };
      Monster = __decorate([ ccclass ], Monster);
      return Monster;
    }(cc.Component);
    exports.default = Monster;
    cc._RF.pop();
  }, {
    "./GameManager": "GameManager"
  } ],
  Player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c66e4G3AcpI24NSYsCKjmH8", "Player");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Player = function(_super) {
      __extends(Player, _super);
      function Player() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._animation = null;
        _this._animationName = [ "characterIdle", "characterAtk1", "characterAtk2", "characterAtk3" ];
        _this._baseScale = .5;
        _this._currentAtkAnim = 0;
        _this._atkAnimationInterval = .2;
        _this._actionTimeout = -1;
        return _this;
      }
      Player.prototype.onLoad = function() {
        this._animation = this.getComponent(cc.Animation);
        this._animation.on("finished", this.onAnimFinishedCallback, this);
      };
      Player.prototype.init = function() {};
      Player.prototype.leftAction = function() {
        this.node.scaleX = -1 * this._baseScale;
        this._playAtkAnim();
      };
      Player.prototype.rightAction = function() {
        this.node.scaleX = this._baseScale;
        this._playAtkAnim();
      };
      Player.prototype._playAtkAnim = function() {
        this._currentAtkAnim++;
        this._currentAtkAnim > 3 && (this._currentAtkAnim = 1);
        clearTimeout(this._actionTimeout);
        this._actionTimeout = -1;
        this._animation.play("characterAtk" + this._currentAtkAnim);
      };
      Player.prototype.onAnimFinishedCallback = function() {
        var _this = this;
        this._actionTimeout = setTimeout(function() {
          _this._animation.play("characterIdle");
          _this._currentAtkAnim = 0;
          _this._actionTimeout = -1;
        }, 1e3 * this._atkAnimationInterval);
      };
      Player = __decorate([ ccclass ], Player);
      return Player;
    }(cc.Component);
    exports.default = Player;
    cc._RF.pop();
  }, {} ],
  ScoreUIController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ed0da5VlfBPErq9rB13bhFB", "ScoreUIController");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameManager_1 = require("./GameManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._gameManager = null;
        _this._lbScore = null;
        _this._lbCombo = null;
        _this._lbLife = null;
        _this._lbTotal = null;
        _this._btnMain = null;
        _this._btnRetry = null;
        _this._targetLabel = null;
        _this._counter = 20;
        _this._countingTime = 1;
        _this._score = 0;
        _this._combo = 0;
        _this._life = 0;
        return _this;
      }
      NewClass.prototype.onLoad = function() {
        this._gameManager = cc.find("GameManager").getComponent(GameManager_1.default);
        this._lbScore = cc.find("lbScore2", this.node).getComponent(cc.Label);
        this._lbCombo = cc.find("lbCombo2", this.node).getComponent(cc.Label);
        this._lbLife = cc.find("lbLife2", this.node).getComponent(cc.Label);
        this._lbTotal = cc.find("lbTotal2", this.node).getComponent(cc.Label);
        this._btnMain = cc.find("btnMain", this.node);
        this._btnRetry = cc.find("btnRetry", this.node);
        this._btnMain.active = false;
        this._btnRetry.active = false;
        this._btnMain.on("click", this._gameManager.showMain, this._gameManager);
        this._btnRetry.on("click", this._gameManager.restartGame, this._gameManager);
        this.node.on("click", this._skipCounting, this);
      };
      NewClass.prototype.showResult = function(score, combo, life) {
        var _this = this;
        this._score = score;
        this._combo = combo;
        this._life = life;
        this._lbScore.string = "";
        this._lbCombo.string = "";
        this._lbLife.string = "";
        this._lbTotal.string = "";
        cc.tween(this.node).call(function() {
          _this._labelCounting(_this._lbScore, 0, score);
          _this._labelCounting(_this._lbTotal, 0, score);
        }).delay(this._countingTime + .5).call(function() {
          _this._labelCounting(_this._lbCombo, 0, combo);
          _this._labelCounting(_this._lbTotal, score, score + combo);
        }).delay(this._countingTime + .5).call(function() {
          _this._labelCounting(_this._lbLife, 0, life);
          _this._labelCounting(_this._lbTotal, score + combo, score + combo + life);
        }).delay(this._countingTime + .5).call(function() {
          _this._showRetry();
        }).start();
      };
      NewClass.prototype._labelCounting = function(label, start, end) {
        var dt = this._countingTime / this._counter;
        var currNum = start;
        var dcount = (end - start) / this._counter;
        label.schedule(function() {
          currNum += dcount;
          label.string = Math.round(currNum).toString();
        }, dt, this._counter - 1);
      };
      NewClass.prototype._skipCounting = function() {
        cc.director.getActionManager().removeAllActionsFromTarget(this.node, true);
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
      NewClass.prototype._showRetry = function() {
        this._btnMain.active = true;
        this._btnRetry.active = true;
      };
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {
    "./GameManager": "GameManager"
  } ]
}, {}, [ "GameManager", "GameUIController", "InputManager", "MenuUIController", "Monster", "Player", "ScoreUIController" ]);
//# sourceMappingURL=index.js.map
