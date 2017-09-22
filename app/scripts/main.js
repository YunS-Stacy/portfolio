const cards = [{
  cat: ['urban', 'web'],
  name: 'Urban Planning',
  title: 'AngularDe',
  desc: 'Description',
  date: '0w9/12/12'
}, {
  cat: ['urban'],
  name: 'jjuhg',
  title: 'AngularDe',
  desc: 'Description',
  date: 'e09/12/12'
}, {
  cat: ['web'],
  name: '3',
  title: 'AngularDe',
  desc: 'Description',
  date: '0w9/12/12'
}, {
  cat: ['web'],
  name: '4',
  title: 'AngularDe',
  desc: 'Description',
  date: '0w9/12/12'

}];

let camera, scene, renderer;
let controls;

let objs = [];
let selection = [];
let targets = { table: [], grid: [] };

const init = () => {

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 3000;

  scene = new THREE.Scene();

  // 
  cards.forEach(el => {
    const element = $(`
        <div class="card-item">
            <div class="cat">${el.cat}</div>
            <div class="name">${el.name}</div>
            <div class="desc">${el.desc}</div>
            <div class="date">${el.date}</div>
        </div>`);
    el.cat.forEach(datum => {
      element.addClass(datum);
    })

    const obj = new THREE.CSS3DObject(element[0]);
    obj.name=`${el.cat}`;
    scene.add(obj);
    objs.push(obj);
    
    $(element).click(ev => {
      $(element).toggleClass('-on');
      $(element).siblings().removeClass('-on');

      transform(targets.grid, 2000);
      // assign new position as grid position
      Object.assign(obj.position, targets.grid[objs.indexOf(obj)].position)
      let target = targets.grid[objs.indexOf(obj)];
      target.position.x -= 1000;
      target.position.z = 2500;
      new TWEEN.Tween(obj.position)
        .to({ x: target.position.x, z: target.position.z }, 1000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .delay(3000)
        .start();

      // new TWEEN.Tween(obj.position)
      //   .to({ z: target.position.z }, 1000)
      //   .easing(TWEEN.Easing.Exponential.InOut)
      //   .delay(3000)
      //   .start();

      new TWEEN.Tween(this)
        .to({}, (2000 + 1000 + 2000 + 1000 + 3000))
        .onUpdate(render)
        .start();

      console.log(obj)
      ev.stopPropagation();
      // $(element).addClass('-on');
      // console.log(ev);
      // $('.project-info').text(`${el.desc}`)
      // $('.project-info').toggleClass('-show');
    })

  });
  setTable();
  setGrid();
  //

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize($(document).width(), $(document).height());
  $(renderer.domElement).addClass('cards-list');
  $('.main-view').append(renderer.domElement);

  //

  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  $(controls).change(render);

  $('#table').click(() => {
    transform(targets.table, 2000);
  });

  $('#grid').click(() => {
    transform(targets.grid, 2000);
  });

  $('.sort').click((ev) => {

    $(ev.target).toggleClass('-clicked');

    const klass = Array.from($(ev.target)[0].classList).filter(el => {
      return el !== 'sort' && !el.includes('-');
    })[0];
    if (klass) {
      // $(`.card-item:not(.${klass})`).removeClass('-group');
      $(`.card-item.${klass}`).addClass('-group');

    };
  });

  transform(targets.table, 2000);
  //
  $(window).resize(onWindowResize);
}

const transform = (dest, duration) => {
  console.log(dest === targets.grid)

  if (dest === targets.grid) {
    console.log(dest === targets.grid)
    $('.card-list').addClass('-grid');
  }
    TWEEN.removeAll();
  objs.forEach((el, i) => {
    const obj = objs[i];
    const target = dest[i];

    new TWEEN.Tween(obj.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

  });

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();


}

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const animate = () => {
  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();
}

const render = () => {
  renderer.render(scene, camera);
}

const setTable = () => {
  targets.table.pop();

  // table
  cards.forEach((el, i) => {
    const objTable = new THREE.Object3D();
    objTable.position.x = ((i % 2) * 300) - 300;
    objTable.position.y = - ((Math.floor(i / 2) - 1) * 300);
    objTable.position.z = 1000;
    console.log(objTable.position, 'table position')
    targets.table.push(objTable);
  })
}

const setGrid = () => {
  // grid
  targets.grid = [];
  cards.forEach((el, i) => {
    const obj = new THREE.Object3D();
    obj.position.x = 1000;
    obj.position.y = 0;
    obj.position.z = i * 500;
    targets.grid.push(obj);
  });
}

init();
animate();