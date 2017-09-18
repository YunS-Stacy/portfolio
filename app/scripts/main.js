const cards = [{
  cat: 'Urban Planning',
  name: 'Urban Planning',
  title: 'AngularDe',
  desc: 'Description',
  date: '0w9/12/12'
}, {
  cat: 'Urban Planning',
  name: 'jjuhg',
  title: 'AngularDe',
  desc: 'Description',
  date: 'e09/12/12'
}, {
  cat: 'Urban Planning',
  name: '3',
  title: 'AngularDe',
  desc: 'Description',
  date: '0w9/12/12'
}, {
  cat: 'Urban Planning',
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

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 3000;
  console.log(camera.position, 'camera')

  scene = new THREE.Scene();

  // 
  cards.forEach((el, i) => {
    const element = $(`
        <div class="card-item ${el.cat}" id="${i}">
            <div class="cat">${el.cat}</div>
            <div class="name">${el.name}</div>
            <div class="desc">${el.desc}</div>
            <div class="date">${el.date}</div>
        </div>`);
    $(element).click(ev => {
      ev.stopPropagation();
      $(element).addClass('-on');
      console.log(ev);
        $('.project-info').text(`${el.desc}`)
        $('.project-info').addClass('-show');

    })
    const obj = new THREE.CSS3DObject(element[0]);
    obj.name=`${i}`;
    scene.add(obj);

    objs.push(obj);
    console.log(objs)
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
    objs = _.sortBy(objs, 'name').reverse();
    transform(targets.grid, 2000);

    if (selection.length > 0) {
      selection.forEach(el => {
        $(el).removeClass('-on')
      })
    }
    selection.pop();
    const el = $(ev.target).text();
    switch (el) {
      case 'Planning':
        $('.card-item.Urban.Planning').addClass('-on');
        selection.push($('.card-item.Urban.Planning'));
        break;
    
      default:
        break;
    }
    console.log(selection)
  });

  transform(targets.table, 2000);
  //
  $(window).resize(onWindowResize);
}

function transform(targets, duration, type) {
  TWEEN.removeAll();
  objs.forEach((el, i) => {
    var obj = objs[i];
    var target = targets[i];

    new TWEEN.Tween(obj.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

  });
  if (type === 'grid') {
    new TWEEN.Tween(camera.position)
      .to({ x: 5000 }, duration * 2)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  } else {
    new TWEEN.Tween(camera.position)
      .to({ x: 0 }, duration * 2)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }



  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();
}

function render() {
  renderer.render(scene, camera);
}

function setTable() {
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

function setGrid() {
  // grid
  targets.grid.pop();
  cards.forEach((el, i) => {
    var obj = new THREE.Object3D();
    obj.position.x = ((i % 2) * 400) + 300;
    obj.position.y = (- (Math.floor(i / 2) % 2) * 200);
    obj.position.z = (Math.floor(i / 2)) * 500;
    console.log(obj.position, 'grid position')
    targets.grid.push(obj);
  });
}