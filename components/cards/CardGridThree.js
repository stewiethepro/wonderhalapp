import Link from "next/link";

  export default function CardGridThree({cards}) {
      const {primaryCard, secondaryCards} = cards;

      return (
        <>
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
              <div className="group aspect-w-2 aspect-h-1 shadow-2xl rounded-lg overflow-hidden sm:aspect-h-5 sm:aspect-w-6 sm:row-span-2 transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300">
                <img
                  src={primaryCard.imageSrc}
                  alt={primaryCard.imageAlt}
                  className="object-center object-cover"
                />
                <div aria-hidden="true" className={`bg-gradient-to-b from-transparent to-${primaryCard.color} opacity-30`}/>
                <div className="p-6 flex items-end ">
                  <div>
                    <h3 className="font-semibold text-white">
                      <Link href={primaryCard.href}>
                        <a>
                          <span className="absolute inset-0"/>
                          {primaryCard.name}
                        </a>
                      </Link>
                    </h3>
                    <p aria-hidden="true" className="mt-1 text-sm text-white">
                    {primaryCard.description}
                    </p>
                  </div>
                </div>
              </div>

              {secondaryCards.map((secondaryCard) => (
                <div key={secondaryCard.name} className="group aspect-w-2 aspect-h-1 shadow-2xl rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full transition ease-in-out hover:-translate-y-1 hover:scale-105 duration-300">
                  <img
                    src={secondaryCard.imageSrc}
                    alt={secondaryCard.imageAlt}
                    className="object-center object-cover sm:absolute sm:inset-0 sm:w-full sm:h-full"
                  />
                  <div
                    aria-hidden="true"
                    className={`bg-gradient-to-b from-transparent to-${secondaryCard.color} opacity-30 sm:absolute sm:inset-0`}
                  />
                  <div className="p-6 flex items-end sm:absolute sm:inset-0">
                    <div>
                      <h3 className="font-semibold text-white">
                        <Link href={secondaryCard.href}>
                          <a>
                            <span className="absolute inset-0" />
                            {secondaryCard.name}
                          </a>
                        </Link>
                      </h3>
                      <p aria-hidden="true" className="mt-1 text-sm text-white">
                      {secondaryCard.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
      )
  }