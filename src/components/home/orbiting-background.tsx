'use client'
import OrbitingCircles from '../ui/orbiting-circles'
import Avatar from 'react-nice-avatar'

export function OrbitingBackground() {
  return (
    <div className="relative flex h-[200vh] w-full flex-col items-center justify-center overflow-hidden">
      <OrbitingCircles
        className="size-[50px] dark:bg-secondary backdrop-blur-md border border-neutral-700/80"
        duration={20}
        delay={20}
        radius={800}>
        <Avatar className="size-[50px] z-40" bgColor="transparent" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] dark:bg-secondary backdrop-blur-md border border-neutral-700/80"
        duration={20}
        delay={30}
        radius={800}>
        <Avatar className="size-[50px] z-40" bgColor="transparent" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] dark:bg-secondary backdrop-blur-md border border-neutral-700/80"
        duration={20}
        delay={10}
        radius={600}>
        <Avatar className="size-[50px] z-40" bgColor="transparent" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] dark:bg-secondary backdrop-blur-md border border-neutral-700/80"
        duration={20}
        delay={20}
        radius={600}>
        <Avatar className="size-[50px] z-40" bgColor="transparent" />
      </OrbitingCircles>

      <OrbitingCircles
        className="size-[50px] dark:bg-secondary backdrop-blur-md border border-neutral-700/80"
        radius={400}
        duration={20}
        reverse>
        <Avatar className="size-[50px] z-40" bgColor="transparent" />
      </OrbitingCircles>
      <OrbitingCircles
        className="size-[50px] dark:bg-secondary backdrop-blur-md border border-neutral-700/80"
        radius={400}
        duration={20}
        delay={30}
        reverse>
        <Avatar className="size-[50px] z-40" bgColor="transparent" />
      </OrbitingCircles>
    </div>
  )
}
