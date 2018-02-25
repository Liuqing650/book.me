# G6 图像坐标

```
    |(canvas原点)
  ──┼──────────────────────────
    |           |
    |           |
    |   iii     |    iiii
    |           |
    |-----------(graph-center)
    |           |
    |    ii     |    i
    |           |

            （图）
```

## 画布区简述

  画布中分为两层 canvas, 第一层用于展示图形，第二层用于行为交互。分别会以 `id=canvas_1` 和 `id=canvas_2` 进行标记。

  在图形中，有两个坐标轴基准，一个是 canvas 的坐标轴基准，其原点在左上角， 另外一个是 graph 的坐标基准，其原点为初始化时，根节点`(0, 0)`所处的位置。

  graph 是一个上下翻转的坐标轴，第一象限在数学模型中的第四象限区中，第四象限在数学模型的第一象限中。

  graph 坐标与 canvas 坐标将用过 `(domX, domY)` 一一隐射，可以理解为 canvas 的坐标就是点击任意画布获取的 `(domX, domY)` 。 

## 移动简述

  使用 **Matrix3** 中的 `matrix.translate(x, y)` 进行仿射平移时，如果没有在 **Matrix3** 中设定缩放比例，则默认按照缩放比例 scale = 1 进行缩放并平移。

  使用 **Matrix3** 中的 `matrix.scale(sx, sy)` 进行仿射缩放时，如果没有在 **Matrix3** 中进行仿射平移，则默认按照 `matrix.translate(0, 0)` 进行平移并缩放。

  即平移和缩放中都一个默认值，无论调用任何一个函数，都会执行缩放和平移，没有赋值（或者说调用该函数）的时候，将调用默认值进行缩放或者平移。

  在针对任意一个点 M(x0, y0) 进行只移动，不缩放时，要将原画布缩放比例设置为 **1** 即可调用 `matrix.translate(x0, y0)` 进行无缩放偏移。

## 移动原理

  仿射平移 `matrix.translate(x, y)` 是将整个 graph 移动到原点为 `(x, y)` 处，换句话说，就是将 graph 的根节点移动到 `(x, y)`处， graph 中其他坐标一一对应移动，
  G6利用矩阵的移动进行平移整个图形，


（0,0）点的时候，缩放移动到画布的顶角处，
这个点同时也是node的根节点， graph 则是以根节点为原点

可以确定的是，点击任意位置获取的 (even.x, even.y) 和 node 中 model 的 (x,y) 性质相同，都是 graph 的位置;
而 (even.domX, even.domY) 则是 canvas 的点

同时还要注意的是在 graph 中，象限是反的， 如图所示

当我设置移动的节点是（0,0）的时候，进行转换后图像移动到顶点

当我设置为（100,100）的时候,画布移动到偏顶点的位置

1. 以 canvas 的坐标为坐标的 graph 移动 
如果只是进行单个方向的移动，例如：

```
zoom = {x: 0, 0}
matrix.translate(zoom.x, zoom.y);
```

那么，这里将把 graph 的原点移动到 canvas 的原点上面，并且两者重合

再次进行改动

```
zoom = {x: 10, 10}
matrix.translate(zoom.x, zoom.y);
```

这时， graph 的原点移动到以 canvas 原点为坐标原点的坐标轴上 (10, 10) 的位置处。

以上两点可以说明： 

> matrix.translate(x, y) 方法
> 使用的时候将直接把 graph 的坐标等值传递给 canvas 的坐标轴上
> 因此，如果 graph 中点击任意位置获取的 (even.x, even.y) 直接进行 translate 的话，那么该节点的位置将会移动到 canvas 中 "坐标值" 相等的位置，导致画布与实际看到的完全不吻合

2. 官网示例中先进行了(-x, -y)的移动，变换完成之后再(x, y)移动。

zoom = {x: 0, y: 0}; 无论如何变换将保持不变，始终处于 canvas 的原点，无需探讨

当 zoom = {x: 10, y: 10}; 的时候
先进行 负数移动
matrix.translate(-zoom.x, -zoom.y);

这时， graph 中 even 的x,y 为(10, 10) 的点位于 canvas 的原点 (0, 0)

再进行 正数移动
matrix.translate(zoom.x, zoom.y);

这时， graph 中 even 的x,y 为(0, 0) 的点位于 canvas 的原点 (0, 0)

以上两步可以说明：

> 在进行 负数移动的时候， graph 的整体图像在 以 canvas 原点为坐标轴的画布中往 (-10, -10) 方向进行了偏移， 注意 graph 的坐标象限是一个反的(如图所示), 因此看到根节点只有小部分还处于可视区域。 
> 负数移动后的 graph 中所有的 (even.x , even.y) 都成为了 (even.x -10, even.y - 10), 而与之对应的 (even.domX, even.domY) 也相应发生的变换。
> 转换方法： (even.domX, even.domY) = graph.converPoint(even.x, even.y)；
> 再进行 正数移动， 这时 graph 中的点已经为 (even.x -10, even.y - 10), 所以再次进行正数移动就是： (even.x -10 + 10, even.y - 10 + 10) = (even.x , even.y)。
> 因此其实移动的点经历了 一正一反 两次变化，但实际 graph 的位置并没有改变， 此时使用 graph 的(x, y)去对应 canavs的 坐标，就会出现 **第 1 点** 的验证情况，出现错位。

3. 如何将点击的位置放到 canvas 的中心？

首先，假设点击的位置为(m, n)
正数或者负数移动的过程之中， (even.x -/+ m, even.y -/+ n), 此时的位置经过 converPoint(x, y) 计算出对应的 canvas 坐标， 就直接将目前的 graph 放到与 canvas 对应的坐标上去

graph 中的象限是反的，且真实原点为 graph 的根节点的(x, y), 而非 canvas 的中心点,
graph根节点的坐标(graph.x, graph.y) = (0, 0)
因此，我们很容易可以找到对应的 `(domX, domY) = graph.converPoint(0,0);`
假设是一个 width= 800, heigt= 600 的画布，那么 graph 和canvas 的对应关系为

```
graph               canvas                 放大倍数 scale (0.57)
(0, 0)          = (486,248) 原点 
(100, 100)      = (543,305) i 象限        (486 + 57, 248 + 57)
(-100, 100)     = (429,305) ii 象限       (486 - 57, 248 + 57)
(-100, -100)    = (429,191) iii 象限      (486 - 57, 248 - 57)
(100, -100)     = (543,191) iiii 象限     (486 - 57, 248 - 57)
```

graph 的坐标和 canvas 的坐标对应关系为

```
// canvas 坐标
(even.domX, even.domY) = graph.converPoint(even.x, even.y);

// domX, domY 坐标实际位置计算规则
(domX, domY) = (root.domX + scale * m, root.domX + scale * n);

// 比例
scale = this.graph.getScale();

// 偏移
matrix.translate(zoom.x, zoom.y);
```

而 canvas 的中心位置 center(x,y) 为 (width/2, height/2) = (400, 300)

  如何将根节点移动到 center 这个位置上去
                  (x, y)    (domX, domY)
      即将 graph 中 (0, 0) => (400, 300)
      
      1. 根据上面的公式，我们需要获得 graph 的 scale ,以及 even 的 (domX, domY)
          ```
          const m = 0, n = 0;
          const scale = this.graph.getScale(); // 0.57
          const dom = {x: even.domX, y: even.domY}; // (486,248)
          ```
      2. 此时，我们获取到了 dom 位置， 这个时候如果偏移则将会把 graph 偏移到 canvas 中 (486, 248) 的点。也就是位置不变，可能点击的时候会放大到1倍的尺寸

      3. 此时 graph 的位置其实并没有变化, 但如果将 m = n = 10 的时候，位置就开始往第一象限进行偏移了。
      我们想让 graph 的(m , n)位置处于 center 位置，就需要将 dom 的位置移动到 cenetr中去，
      让 dom = center

      例如当前 dom = (486, 248)
      应该再进行 (center.x - dom.x, center.y - dom.y)的偏移量即可
      即真实偏移位置为: (400 - 486, 300 - 248) = (-86, 52)
      也就是在保证现有的位置不变的情况下，还需要偏移 (-86, 52)就是中心点的位置

      a(20,20) c(50,50)
      a -> c
      a(20 + 30, 20 + 30)
      (x, y) => canvas(x, y)
      (-86, 52) 移动，则直接到canvas 的第二象限
      (400, 300) 移动，则直接为 graph 的(400, 300)的点
      
      每一次移动都将以上一步的 graph (x, y)或者里面的 (domX, domY) 为计算点，进行下一步移动

      那么，移动其实就是 graph 在 canvas 上面进行移动，不能只针对点击的某个点去移动，那样是无法移动到想要的位置。
      所以，移动的思路，是在 graph 中选取一个定点，以定点的位置为graph的位置， 点击处作为一个计算值，用于计算该点到中心处需要移动的路程: (mx, my), 这个差值也正是 整个graph 需要进行移动的方向 
      还需要先通过 graph.converPoint({x:0, y:0});找到根节点的 (domX, domY)
      再获取点击处的位置 (cx, cy) ,取domX, domY 就好
      如果 (cx, cy) 想要移动到中心点，还需要移动为 
      (mx, my) = (center.x - cx, center.y - cy)
      需要根据点击的点距离中心的位置，进行移动 (mx, my) 即可
      - 每次点击移动钱需要判断该位置是否已经在中心点了
      - 每次平移的时候，缩放比例将按照 1 计算，因此，每一次都需要先获取到当前比例

      每次点击的时候将当前的点和 root节点的dom点进行比较，其实在移动的时候, (graph.x, graph.y) 并没有改变，改变的只是与之对应的 (graph.domX, graph.domY) 所以，希望位置修改， 还需要获取每一步的 (graph.domX, graph.domY)的位置，
      两种方式，1， 想办法获取该点的 domX, domY
      2， 全程记录下root 的domX, domY 的位置，并通过放大倍数记录下来
      这里遇到了一个问题； converPoint(x, y)方法只能获取固定的一个 (x, y) 去计算domX, domY,没有办法通过某个节点去获取

      在初始化的时候：
      ```
      const rootDom = {
        x: this.initRoot.x + scale * move.x,
        y: this.initRoot.y + scale * move.y
      }
      ```
      拿到根节点的 dom 位置，在使用公式
      (root.domX, root.domY) = (rootInit.domX + scale * m, rootInit.domX + scale * n);
      计算出当前根节点的位置


      当我将点击的dom位置进行移动的时候，出现的效果为: root 节点立即移动到了点击处，

      根据上面的公式
      (domX, domY) = (root.domX + scale * m, root.domX + scale * n);
      也可以恰好计算出根节点的dom位置正好等于点击处的 canvas 坐标


      ```
          const move = node;
          const matrix = new G6.Matrix.Matrix3();
          matrix.translate(move.domX, move.domY);
          graph.updateMatrix(matrix);
          graph.refresh();
      ```

      也就是说画布的移动其实就是根节点的移动，G6 也是根据根节点的dom映射到canvas中对应的点坐标上。无论如何变换，root的初始dom位置 
      (root.domX, root.domY)并没有改变。变得只有scale 和 (m, n)




## 矩阵平移

矩阵乘法的本质是线性空间运动的描述

设某点向x方向移动 dx, y方向移动 dy ,[x,y]为变换前坐标， [X,Y]为变换后坐标。
则 X = x+dx;  Y = y+dy;

在矩阵中
```
矩阵中  X = x+dx;  Y = y+dy;

                    [1   0   0]
[X  Y  1] = [x y 1] [0   1   0]
                    [dx  dy  1]

计算：

        [1   0   0]
[x y 1] [0   1   0] = [(x*1 + y*0 + 1*dx)  (x*0 + y*1 + 1*dy) (x*0 + y*0 + 1*1)]
        [dx  dy  1]

                    = [(x + dx)  (y + dy)  1]

即：

[X  Y  1] = [(x + dx)  (y + dy)  1]

```

每一次缩放都需要让 root 的当前节点保持到最新状态，也就是上一步的数据在平移后，应该移动到什么位置时，中心点不会发生变化

node(domX, domY)


## 缩放

API

```
/**
 * 仿射缩放
 * @param  {Number} sx   横轴缩放比率
 * @param  {Number} sy   纵轴缩放比率
 */
matrix.scale(sx, sy);
```

每一次缩放的时候，只在一个点点击进行放大的时候，发现 (node.x, node.y) 在偏移， (domX, domY) 没有改变。
其实每一次放大都是将坐标轴比例给扩大了，使得整个图形被动进行了扩展，因此图形自然就变得更加大了。因此光标不动的时候，图像的扩展，导致聚焦的点逐步偏移
通过点击 graph 的相同位置能够证实其实 (node.x, node.y)没有变更， 只是(domX, domY) 在偏移。

偏移公式：

```
domX = domX * (1 + scale);
domY = domY * (1 + scale);
```

### 测试

1. 先只加入缩放 

```
    const matrix = new G6.Matrix.Matrix3();
    matrix.scale(scale, scale);
    graph.updateMatrix(matrix);
    graph.refresh();
```

发现缩放后的图形一直位于 `canvas` 的原点， `graph` 的原点和 `canvas` 的原点始终重合，说明如果不指定平移，那么将以默认的原点值进行平移。

2. 加入平移

```
    const matrix = new G6.Matrix.Matrix3();
    matrix.scale(scale, scale);
    matrix.translate(10, 10);
    graph.updateMatrix(matrix);
    graph.refresh();
```

发现缩放后的 `graph` 的原点一直位于 `canvas` 的 `(10, 10)` 的位置上面， 缩放 `graph` 时原点始终在这点保持不变，其他的 (node.x, node.y) 位置也相对不变。


###
分析发现，只在画布某一点进行放大的时候，domX, domY 无变法，`graph` 在不断以放大的比例进行拉伸和修改图形。点击放大后，需要获取到画布中心的点即可。进行不断进行缩放, 

怎么查找中心点的 node(x, y)?

```
centerNode = this.graph.invertPoint(this.center);
```
先记录下缩放前的中心点，在放大后将该中心点进行移动
graph.updateMatrix(matrix);
每一次放大后，


### 分析
因此，每一次如果希望缩放的位置不变更，只能将图像的 `(domX, domY)` 进行实时更新，记录缩放的比例 `scale` 值，在进行下一次缩放之前，计算出需要移动多少才能够保证放大的点还处于 **已经发生变化** 的 `canvas` 坐标系中心。

需要进行以下4步： 
1. 缓存下当前点击的dom点 `(domX, domY)`
2. 获取即将缩放的比例，计算出放大后原本处于中心的点将偏移到何处。
3. 计算此刻的根节点需要偏移到什么位置时候，原本处于中心的点能够依然位于中心。
4. 缩放完成以后进行偏移

### 调试步骤

1. 点击点存入 dom 点。
2. 获取缩放比例，

## canvas 图像下载
如果使用单纯的放大宽度和高度，不仅仅增加了cpu、GPU 的负载，还受最大面积限制，如果图像过于庞大，可以思考一下如何增加 canvas 的像素点。研究canvas对像素点的处理，也许就清晰了。
【理论上可行，参考网页端的ps】


## 附加知识

>矩阵的平移和伸缩： http://blog.csdn.net/rabbitguiming/article/details/3962974
http://blog.csdn.net/zsq306650083/article/details/8776168 (更好)

涉及到点乘和叉乘
----
点乘,也叫向量的内积、数量积.顾名思义,求下来的结果是一个数.
向量a·向量b=|a||b|cos
在物理学中,已知力与位移求功,实际上就是求向量F与向量s的内积,即要用点乘.

叉乘,也叫向量的外积、向量积.顾名思义,求下来的结果是一个向量,记这个向量为c.

|向量c|=|向量a×向量b|=|a||b|sin 

向量c的方向与a,b所在的平面垂直,且方向要用“右手法则”判断（用右手的四指先表示向量a的方向,然后手指朝着手心的方向摆动到向量b的方向,大拇指所指的方向就是向量c的方向）.
因此 
向量的外积不遵守乘法交换率,因为 
向量a×向量b=-向量b×向量a 
在物理学中,已知力与力臂求力矩,就是向量的外积,即叉乘.
将向量用坐标表示（三维向量）,
若
向量a=(a1,b1,c1),向量b=(a2,b2,c2),
则 
向量a·向量b=a1a2 + b1b2 + c1c2

                | i j k  | 
向量a × 向量b =  |a1 b1 c1|  =(b1c2-b2c1, c1a2-a1c2, a1b2-a2b1) 
                |a2 b2 c2|

（i、j、k分别为空间中相互垂直的三条坐标轴的单位向量）.



## 
http://blog.csdn.net/u010027419/article/details/41944423

canvas对图片的像素级处理--ImageData的应用
https://www.cnblogs.com/suspiderweb/p/4936723.html 

canvas 像素
http://www.360doc.com/content/16/0519/08/21698478_560342454.shtml

CanvasRenderingContext2D.putImageData()
https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/putImageData

像素操作
https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
