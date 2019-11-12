/* eslint-disable */

const dom = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Codejam-palette</title>
  </head>
  <body>
    <div class="container">
      <header class="header">
        <div class="header__wrapper">
          <div class="header__icon-aside">
            <img src="../assets/images/icon-aside.svg" alt="Aside" />
          </div>
          <div class="header__title">CodeJam - Pallete</div>
          <div class="header__icon-menu">
            <img src="../assets/images/icon-menu.svg" alt="Menu" />
          </div>
        </div>
      </header>
      <aside class="aside-left">
        <div class="aside-left__tools">
          <div class="aside-left__tool" data-tool="pencil" data-shortcut="p">
            <div class="aside-left__tool-icon">
              <img src="../assets/images/tool-pencil.svg" alt="Paint bucket tool" />
            </div>
            <div class="aside-left__tool-name">Pencil (P)</div>
          </div>
          <div class="aside-left__tool" data-tool="paint-bucket" data-shortcut="b">
            <div class="aside-left__tool-icon">
              <img src="../assets/images/tool-paint-bucket.svg" alt="Paint bucket tool" />
            </div>
            <div class="aside-left__tool-name">Fill bucket (B)</div>
          </div>
          <div class="aside-left__tool" data-tool="choose-color" data-shortcut="c">
            <div class="aside-left__tool-icon">
              <img src="../assets/images/tool-choose-color.svg" alt="Choose color tool" />
            </div>
            <div class="aside-left__tool-name">Choose color (C)</div>
          </div>
          <hr />
          <div class="aside-left__tool aside-left__tool_disable">
            <div class="aside-left__tool-icon">
              <img src="../assets/images/tool-move.svg" alt="Move tool" />
            </div>
            <div class="aside-left__tool-name">Move</div>
          </div>
          <div class="aside-left__tool aside-left__tool_disable">
            <div class="aside-left__tool-icon">
              <img src="../assets/images/tool-transform.svg" alt="Transform tools" />
            </div>
            <div class="aside-left__tool-name">Transform</div>
          </div>
        </div>
        <div class="aside-left__colors">
          <div class="aside-left__color">
            <input id="custom-color" type="color" />
            <div class="aside-left__color-example color-example_current"></div>
            <div class="aside-left__color-name">Current color</div>
          </div>
          <div class="aside-left__color">
            <div class="aside-left__color-example color-example_prev"></div>
            <div class="aside-left__color-name">Prev color</div>
          </div>
          <hr />
          <div class="aside-left__color" data-color="#f74141">
            <div class="aside-left__color-example color-example_pre-install-1"></div>
            <div class="aside-left__color-name">red</div>
          </div>
          <div class="aside-left__color" data-color="#41b6f7">
            <div class="aside-left__color-example color-example_pre-install-2"></div>
            <div class="aside-left__color-name">blue</div>
          </div>
        </div>
      </aside>
      <main class="main-section">
        <div class="error-msg">
          Не удалось загрузить данные/картинку для отрисовки.<br />
          Попробуйте еще раз.
        </div>
        <div class="main-section__canvas-wrapper">
          <canvas class="main-section__canvas" id="canvas"></canvas>
          <canvas class="main-section__canvas canvas-rules" id="canvas-rules"></canvas>
        </div>
      </main>
      <aside class="aside-right">
        <p class="aside-right__title">
          Изменить размер рабочей области и загрузить предустановленную картинку
        </p>
        <div class="aside-right__fsizes">
          <div data-size="4" data-src="./assets/data/4x4.json" class="aside-right__fsize">
            <div class="aside-right__fsize-bullet"></div>
            <div class="aside-right__fsize-name">4 x 4</div>
          </div>
          <div data-size="16" data-src="./assets/data/16x16.json" class="aside-right__fsize">
            <div class="aside-right__fsize-bullet"></div>
            <div class="aside-right__fsize-name">16 x 16</div>
          </div>
          <div data-size="32" data-src="./assets/data/32x32.json" class="aside-right__fsize">
            <div class="aside-right__fsize-bullet"></div>
            <div class="aside-right__fsize-name">32 x 32</div>
          </div>
        </div>
      </aside>
    </div>
  </body>
</html>`;

test('Canvas element present in DOM', () => {
  document.body.innerHTML = dom;
  const canvas = document.getElementById('canvas');
  expect(canvas).toBeTruthy();
});
