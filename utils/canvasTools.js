//文字换行处理
// canvas 标题超出换行处理
const wordsWrap = (ctx, name, maxWidth, startX, srartY, fontHight, fontSize, alignCenter = false, cardWidth = 520) => {
  let lineWidth = 0;
  let lastSubStrIndex = 0;
  for (let i = 0; i < name.length; i++) {
    lineWidth += ctx.measureText(name[i]).width;
    if (lineWidth >= maxWidth) {
      ctx.fillText(name.substring(lastSubStrIndex, i), startX, srartY);
      srartY += fontHight;
      lineWidth = 0;
      lastSubStrIndex = i;
    }
    if (i == name.length - 1) {
      const laseName = name.substring(lastSubStrIndex, i + 1)
      if (alignCenter) {
        ctx.fillText(laseName, (cardWidth - ctx.measureText(laseName).width) / 2 + 10, srartY);
      } else {
        ctx.fillText(laseName, startX, srartY);
      }
    }
  }
}

// 圆角图片
const circleImg = (ctx, img, x, y, r) => {
  ctx.save();
  ctx.beginPath();
  var d = 2 * r;
  var cx = x + r;
  var cy = y + r;
  ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.clip();
  ctx.drawImage(img, x, y, d, d);
  ctx.restore();
}

/**
 * 圆角背景
 * @param {CanvasContext} ctx canvas上下文
 * @param {number} x 圆角矩形选区的左上角 x坐标
 * @param {number} y 圆角矩形选区的左上角 y坐标
 * @param {number} w 圆角矩形选区的宽度
 * @param {number} h 圆角矩形选区的高度
 * @param {number} r 圆角的半径
 */
const roundRect = (ctx, x, y, w, h, r) => {
  const { cardWidth, cardHeight } = this.data;
  // 开始绘制
  ctx.beginPath()
  // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  // 这里是使用 fill 还是 stroke都可以，二选一即可
  ctx.setFillStyle('transparent')
  // ctx.setStrokeStyle('transparent')
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

  // border-top
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

  // border-right
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

  // border-bottom
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

  // border-left
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)

  // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  ctx.fill()
  // ctx.stroke()
  ctx.closePath()
  // 剪切
  ctx.clip()
}

export default { wordsWrap, circleImg, roundRect}
