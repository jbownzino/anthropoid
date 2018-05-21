//find N points on the radius of a circle from a given point with a given radius -
//basically, calculate points points every n kilometers between coordinates

export const findCoordinates = (lat, long, range) => {
    // How many points do we want? (should probably be function param..)
    var numberOfPoints = 16;
    var degreesPerPoint = 360 / numberOfPoints;

    // Keep track of the angle from centre to radius
    var currentAngle = 0;

    // The points on the radius will be lat+x2, long+y2
    var x2;
    var y2;
    // Track the points we generate to return at the end
    var points = [];

    for (let i = 0; i < numberOfPoints; i++)
    {
        // X2 point will be cosine of angle * radius (range)
        x2 = Math.cos(currentAngle) * range;
        // Y2 point will be sin * range
        y2 = Math.sin(currentAngle) * range;

        // Assuming here you're using points for each x,y..
        p = new Point(lat+x2, long+y2);

        // save to our results array
        points.push(p);

        // Shift our angle around for the next point
        currentAngle += degreesPerPoint;
    }
    // Return the points we've generated
    return points;
}