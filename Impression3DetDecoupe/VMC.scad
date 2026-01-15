// --- PARAMETRES ---
vmc_diameter = 80; 
wall_thickness = 2.0;
clearance = 0.8;
angle_fente = 0; 

// Mettez "axis_motor" pour bien voir la tige hybride
part_to_show = "all"; 

// --- FIN PARAMETRES ---

$fn = 80;

outer_d = vmc_diameter + (wall_thickness * 2);
flap_d = vmc_diameter - (clearance * 2);

square_size = 5; 
hole_d = 8.5; 

pos_axe = outer_d/2 + 8;
shelf_offset = 12; 
z_offset_flap = 7;

module tube() {
    difference() {
        union() {
            cylinder(h = 60, d = outer_d, center = true);
            translate([outer_d/2 + 15, 0, -shelf_offset - 2]) 
                cube([50, 65, 4], center=true); 
        }
        cylinder(h = 65, d = vmc_diameter, center = true);
        rotate([0, 90, 0])
            cylinder(h = outer_d + 50, d = hole_d, center = true);
        translate([pos_axe, 0, -shelf_offset - 2])
            cube([14, 46, 10], center=true); 
    }
}

module flap() {
    difference() {
        union() {
            cylinder(h = 2, d = flap_d);
            translate([-flap_d/2, -6, 2])
                cube([flap_d, 12, 10]);
        }
        translate([0, 0, z_offset_flap])
            rotate([0, 90, 0])
                cube([square_size + 0.6, square_size + 0.6, flap_d + 20], center=true);
        translate([0,0,z_offset_flap]) {
            difference() {
                cylinder(h=50, d=flap_d + 20, center=true);
                sphere(d=flap_d); 
            }
        }
    }
}

module axis_insert() {
    union() {
        // 1. LA TÊTE (D)
        translate([0,0,0]) rotate([0,90,0]) {
            difference() {
                intersection() {
                     // Centré, épaisseur 5mm comme la tige
                     cylinder(h=square_size, d=38, center=true); 
                     translate([0, 15, 0]) cube([40, 40, 20], center=true);
                }
                rotate([0, 0, angle_fente])
                    translate([0, 10, 0]) cube([5.5, 24, 10], center=true);
                translate([0,0,0]) cylinder(h=20, d=2.8, center=true);
            }
        }
        
        // 2. LA TIGE HYBRIDE (Rond - Carré - Rond)
        // La tête est à X=0. Le tube commence à X = -8.
        // Diamètre intérieur du tube = 80mm.
        
        // A. PREMIER ROND (Côté Tête)
        // Il doit traverser l'espace vide (8mm) + le mur (2mm) + un peu de marge
        // Position : part de la tête (X=0) et va vers la gauche
        translate([-8, 0, 0]) 
            rotate([0, 90, 0])
            cylinder(h=16, d=square_size, center=true);

        // B. LE CARRÉ (Au milieu)
        // Il doit être DANS le tube pour entrainer le clapet.
        // Le tube fait 80mm de large à l'intérieur.
        // On fait un carré de 75mm pour être sûr d'être dedans sans toucher les murs ronds
        translate([-(outer_d/2 + 8), 0, 0]) // Centré sur le tube
            cube([70, square_size, square_size], center=true);

        // C. DEUXIÈME ROND (Côté Opposé)
        // Il traverse l'autre mur
        translate([-(outer_d + 12), 0, 0]) 
            rotate([0, 90, 0])
            cylinder(h=16, d=square_size, center=true);
    }
}

// --- AFFICHAGE ---

if (part_to_show == "tube") tube();
if (part_to_show == "flap") flap();

if (part_to_show == "axis_motor") {
    rotate([0, -90, 0]) axis_insert();
}

if (part_to_show == "all") {
    union() {
        color("LightGrey") tube();
        color("Red") translate([0, 0, -z_offset_flap]) flap(); 
        color("Cyan") translate([pos_axe, 0, 0]) axis_insert();
    }
}
