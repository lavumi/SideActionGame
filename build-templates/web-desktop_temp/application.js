{{System.register([], function (_export, _context) {
    "use strict";
  

    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
  
    function createApplication(_ref) {
      var loadJsListFile = _ref.loadJsListFile,
          fetchWasm = _ref.fetchWasm;
      // NOTE: before here we shall not import any module!
      var promise = Promise.resolve();
      return promise.then(function () {
        return _defineProperty({
          start: start
        }, 'import', topLevelImport);
      });
  
      function start(_ref3) {
        var findCanvas = _ref3.findCanvas;
        var settings;
        var cc;
        return Promise.resolve()
        .then(gamebaseInitialize)
        .then(function () {
          return topLevelImport('cc');
        }).then(function (engine) {
          cc = engine;
          return loadSettingsJson(cc);
        }).then(function () {
          settings = window._CCSettings;
          return initializeGame(cc, settings, findCanvas).then(function () {
            if (!settings.renderPipeline) return cc.game.run();
          }).then(function () {
            if (settings.scriptPackages) {
              return loadModulePacks(settings.scriptPackages);
            }
          }).then(function () {
            return loadJsList(settings.jsList);
          }).then(function () {
            return loadAssetBundle(settings.hasResourcesBundle, settings.hasStartSceneBundle);
          }).then(function () {
            if (settings.renderPipeline) return cc.game.run();
          }).then(function () {
            cc.game.onStart = onGameStarted.bind(null, cc, settings);
            onGameStarted(cc, settings);
          });
        });
      }
  
      function topLevelImport(url) {
        return _context["import"]("".concat(url));
      }
  
      function loadAssetBundle(hasResourcesBundle, hasStartSceneBundle) {
        var promise = Promise.resolve();
        var _cc$AssetManager$Buil = cc.AssetManager.BuiltinBundleName,
            MAIN = _cc$AssetManager$Buil.MAIN,
            RESOURCES = _cc$AssetManager$Buil.RESOURCES,
            START_SCENE = _cc$AssetManager$Buil.START_SCENE;
        var bundleRoot = hasResourcesBundle ? [RESOURCES, MAIN] : [MAIN];
  
        if (hasStartSceneBundle) {
          bundleRoot.push(START_SCENE);
        }
  
        return bundleRoot.reduce(function (pre, name) {
          return pre.then(function () {
            return loadBundle(name);
          });
        }, Promise.resolve());
      }
  
      function loadBundle(name) {
        return new Promise(function (resolve, reject) {
          cc.assetManager.loadBundle(name, function (err, bundle) {
            if (err) {
              return reject(err);
            }
  
            resolve(bundle);
          });
        });
      }
  
      function loadModulePacks(packs) {
        return Promise.all(packs.map(function (pack) {
          return topLevelImport(pack);
        }));
      }
  
      function loadJsList(jsList) {
        var promise = Promise.resolve();
        jsList.forEach(function (jsListFile) {
          promise = promise.then(function () {
            return loadJsListFile("src/".concat(jsListFile));
          });
        });
        return promise;
      }
  
      function loadSettingsJson(cc) {
        var server = '';
        var settings = 'src/settings.json';
        return new Promise(function (resolve, reject) {
          if (typeof fsUtils !== 'undefined' && !settings.startsWith('http')) {
            var result = fsUtils.readJsonSync(settings);
  
            if (result instanceof Error) {
              reject(result);
            } else {
              window._CCSettings = result;
              window._CCSettings.server = server;
              resolve();
            }
          } else {
            var requestSettings = function requestSettings() {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', settings);
              xhr.responseType = 'text';
  
              xhr.onload = function () {
                window._CCSettings = JSON.parse(xhr.response);
                window._CCSettings.server = server;
                resolve();
              };
  
              xhr.onerror = function () {
                if (retryCount-- > 0) {
                  setTimeout(requestSettings, retryInterval);
                } else {
                  reject(new Error('request settings failed!'));
                }
              };
  
              xhr.send(null);
            };
  
            var retryCount = 3;
            var retryInterval = 2000;
            requestSettings();
          }
        });
      }
    }
  
    function initializeGame(cc, settings, findCanvas) {
      if (settings.macros) {
        for (var key in settings.macros) {
          cc.macro[key] = settings.macros[key];
        }
      }
  
      var gameOptions = getGameOptions(cc, settings, findCanvas);
      return Promise.resolve(cc.game.init(gameOptions));
    }
  
    function onGameStarted(cc, settings) {
      window._CCSettings = undefined;
      cc.view.enableRetina(true);
      cc.view.resizeWithBrowserSize(true);
  
      if (cc.sys.isMobile) {
        if (settings.orientation === 'landscape') {
          cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
        } else if (settings.orientation === 'portrait') {
          cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
        }
      }
  
      var launchScene = settings.launchScene; // load scene
  
      cc.director.loadScene(launchScene, null, function () {
        cc.view.setDesignResolutionSize(640, 360, 4);
        console.log("Success to load scene: ".concat(launchScene));
      });
    }
  
    function getGameOptions(cc, settings, findCanvas) {
      // asset library options
      var assetOptions = {
        bundleVers: settings.bundleVers,
        remoteBundles: settings.remoteBundles,
        server: settings.server,
        subpackages: settings.subpackages
      };
      var options = {
        debugMode: settings.debug ? cc.DebugMode.INFO : cc.DebugMode.ERROR,
        showFPS: !false && settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
        renderPipeline: settings.renderPipeline,
        adapter: findCanvas('GameCanvas'),
        assetOptions: assetOptions,
        customJointTextureLayouts: settings.customJointTextureLayouts || [],
        physics: settings.physics
      };
      return options;
    }

    function gamebaseInitialize() {
        var gamebaseConfiguration = {
            appId: 'QENlthLb',    // TOAST Console Project ID
            clientVersion: '0.1.0', // TOAST Console Gamebase App Client Version
            storeCode : "",
            displayLanguageCode: 'en',
            enableDebugMode: true,
            uiConfiguration: {
                enablePopup: true,   // Use Gamebase UI Popup
                enableLaunchingStatusPopup: true,
                enableBanPopup: true,
            }
        };  

        var isPlayable = function(statusCode) {
            if (statusCode >= 200 && statusCode < 300)
                return true;
    
            return false;
        };
    

        return new Promise(( resolve, reject )=>{
            toast.Gamebase.initialize(gamebaseConfiguration, function (launchingInfo, error) {
                if (error) {
                    // 초기화에 실패하면 Gamebase SDK를 이용할 수 없습니다.
                    // appId, clientVersion 및 TOAST Console의 설정이 정상적으로 입력되었는지 확인하세요.
                    console.log('Gamebase initialization failed');
                    console.log(error);

                    reject('Gamebase initialization failed\n' + error);
                    return;
                }
        
                const statusCode = launchingInfo.launching.status.code;
                if (isPlayable(statusCode)) { // Status 값은 하단의 Launching Status Code 표를 참조하시길 바랍니다.
                    // 게임 플레이 가능상태입니다.
                    console.log('Playable!');
                    resolve();
                } else {
                    // 게임 플레이 불가능상태입니다. (점검, 서비스 종료 등)
                    // console.log('Not Playable!');
                    reject('Not Playable!');
                }
            });
        });
    }
  
    _export("createApplication", createApplication);
  
    return {
      setters: [],
      execute: function () {}
    };
  });}}