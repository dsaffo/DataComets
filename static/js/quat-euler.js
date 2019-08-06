function quatToEuler(quat) {

  const q0 = quat[0];
  const q1 = quat[1];
  const q2 = quat[2];
  const q3 = quat[3];

  const Rx = Math.atan2(2 * (q0 * q1 + q2 * q3), 1 - (2 * (q1 * q1 + q2 * q2)));
  const Ry = Math.asin(2 * (q0 * q2 - q3 * q1));
  const Rz = Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - (2  * (q2 * q2 + q3 * q3)));

  const euler = [Rx, Ry, Rz];

  return(euler);
};